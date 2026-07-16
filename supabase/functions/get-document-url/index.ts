import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { S3Client, GetObjectCommand } from "npm:@aws-sdk/client-s3"
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS for browser requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // ==========================================
    // GATE 1: Verify the Admin's Identity
    // ==========================================
    // 1. Grab the token that the dashboard automatically sent
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error("Security Violation: Missing Auth Header")
    }
    
    // 2. Strip out the 'Bearer ' text to get the raw token
    const token = authHeader.replace('Bearer ', '')
    
    // 3. Create a standard client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // 4. Force the client to verify this specific token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error("Security Violation: Unauthorized Access")
    }

    // ==========================================
    // GATE 2: Request the VIP Pass from AWS
    // ==========================================
    // Extract the file path AND the new download flag
    const { file_path, download } = await req.json()
    if (!file_path) {
      throw new Error("Missing file path")
    }

    const s3Client = new S3Client({
      region: Deno.env.get('AWS_REGION') || 'af-south-1',
      credentials: {
        accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID') || '',
        secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY') || '',
      },
    })

    // Setup the base command
    const commandParams: any = {
      Bucket: Deno.env.get('AWS_BUCKET_NAME') || 'nudawn-storage-522826274523-af-south-1-an',
      Key: file_path,
    }

    // THE MAGIC: If the dashboard requests a download, tell AWS to force it
    if (download) {
      const fileName = file_path.split('/').pop() || 'document'
      commandParams.ResponseContentDisposition = `attachment; filename="${fileName}"`
    }

    const command = new GetObjectCommand(commandParams)
    const signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 })

    // Return the secure link to the Dashboard
    return new Response(
      JSON.stringify({ url: signedUrl }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    // Safely check if it's an Error object to satisfy TypeScript
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    
    console.error("Function Error:", errorMessage)
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})