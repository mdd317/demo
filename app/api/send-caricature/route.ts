import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { email, caricatureUrl } = await request.json()

    if (!email || !caricatureUrl) {
      return NextResponse.json({ error: "Missing email or caricature URL" }, { status: 400 })
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 })
    }

    const apiKey = process.env.RESEND_API_KEY
    const from = process.env.EMAIL_FROM || "Elixa AI <onboarding@resend.dev>"

    if (!apiKey) {
      return NextResponse.json({ error: "Missing RESEND_API_KEY" }, { status: 500 })
    }

    // 🔥 Wywołanie Resend REST API
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: email,                       // <<–– TU IDZIE MAIL PODANY W APCE
        subject: "Twoja karykatura AI 🎨",
        html: `
          <p>Cześć! 😄</p>
          <p>Twoja karykatura AI jest gotowa:</p>
          <p>
            <a href="${caricatureUrl}" target="_blank" rel="noopener noreferrer">
              Kliknij tutaj, aby ją zobaczyć
            </a>
          </p>
          <p>
            <img src="${caricatureUrl}" alt="Twoja karykatura" style="max-width: 100%; border-radius: 8px;" />
          </p>
          <p>Pozdrawiamy,<br/>Zespół Elixa AI</p>
        `,
      }),
    })

    const data = await res.json()
    console.log("Resend response:", res.status, data)

    if (!res.ok) {
      return NextResponse.json(
        { error: "Resend API error", details: data },
        { status: 500 }
      )
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Send caricature error:", error)
    return NextResponse.json({ error: "Failed to send caricature" }, { status: 500 })
  }
}
