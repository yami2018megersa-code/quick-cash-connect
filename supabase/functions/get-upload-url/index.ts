import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { S3Client, PutObjectCommand } from "npm:@aws-sdk/client-s3"
import { getSignedUrl } from "npm:@aws-sdk/s3-request-presigner"

// Standard CORS headers so the browser allows the request
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  // Handle CORS preflight browser checks
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { fileName, fileType } = await req.json()

    // 1. Initialize the AWS client using the secure environment variables
    const s3Client = new S3Client({
      region: Deno.env.get('AWS_REGION')!,
      credentials: {
        accessKeyId: Deno.env.get('AWS_ACCESS_KEY_ID')!,
        secretAccessKey: Deno.env.get('AWS_SECRET_ACCESS_KEY')!,
      }
    })

    const bucketName = Deno.env.get('AWS_BUCKET')!

    // 2. Prepare the exact instructions for the AWS Vault
    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: fileName,
      ContentType: fileType,
    })

    // 3. Generate a temporary, 5-minute pre-signed URL
    const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 300 })

    // 4. Return the secure URL back to the React frontend
    return new Response(JSON.stringify({ url: uploadUrl, path: fileName }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return new Response(JSON.stringify({ error: errorMessage }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400 
    })
  }
})