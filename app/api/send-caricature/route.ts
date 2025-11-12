import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, caricatureUrl } = await request.json()

    if (!email || !caricatureUrl) {
      return NextResponse.json({ error: "Missing email or caricature URL" }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    // Placeholder implementation - integrate with email service (Resend, SendGrid, etc.)
    // For now, just log and return success
    console.log(`Caricature sent to ${email}: ${caricatureUrl}`)

    // Example: If using Resend
    // const resend = new Resend(process.env.RESEND_API_KEY)
    // await resend.emails.send({
    //   from: 'noreply@elixaai.com',
    //   to: email,
    //   subject: 'Your AI Caricature',
    //   html: `<img src="${caricatureUrl}" alt="Your caricature" style="max-width: 100%;" />`,
    // })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Send caricature error:", error)
    return NextResponse.json({ error: "Failed to send caricature" }, { status: 500 })
  }
}
