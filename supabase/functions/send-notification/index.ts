import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')

serve(async (req: Request) => {
  try {
    const payload = await req.json()
    const app = payload.record

    const emailHtml = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #0f172a;">New Loan Application Received</h2>
        <p>A new application has been submitted through the portal.</p>
        
        <div style="background-color: #f1f5f9; padding: 16px; border-radius: 8px;">
          <p><strong>Applicant:</strong> ${app.full_name}</p>
          <p><strong>Phone:</strong> ${app.phone}</p>
          <p><strong>Email:</strong> ${app.email}</p>
          <p><strong>Requested Amount:</strong> R${app.amount}</p>
          <p><strong>Employment:</strong> ${app.employment_status.replace(/_/g, " ")}</p>
        </div>

        <p style="color: #64748b; font-size: 12px; margin-top: 24px;">
          🔒 <strong>Security Notice:</strong> The applicant's ID and bank statements have been successfully routed to the secure Cape Town AWS vault. Please log into the Admin Dashboard to review the physical documents.
        </p>
      </div>
    `

    const resendResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: "NuDawn Finances <onboarding@resend.dev>", 
        to: "yami2018megersa@gmail.com", // <-- UPDATE THIS
        subject: `New Application: ${app.full_name} - R${app.amount}`,
        html: emailHtml
      })
    })

    const data = await resendResponse.json()
    
    if (!resendResponse.ok) {
      throw new Error(JSON.stringify(data))
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), { status: 200 })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return new Response(JSON.stringify({ error: errorMessage }), { status: 400 })
  }
})