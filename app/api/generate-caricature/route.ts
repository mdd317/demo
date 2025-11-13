import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File | null

    if (!image) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 })
    }

    const apiKey = process.env.WAVESPEED_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "WAVESPEED_API_KEY missing" }, { status: 500 })
    }

    // Convert uploaded file → base64 URL
    const buffer = Buffer.from(await image.arrayBuffer())
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${image.type};base64,${base64}`

    // Start Wavespeed job (no upload needed!)
    const startRes = await fetch("https://api.wavespeed.ai/api/v3/openai/gpt-image-1", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enable_base64_output: false,
        enable_sync_mode: false,

        image: dataUrl, // <-- Wavespeed accepts this!
        prompt:
          "Funny cartoon caricature, exaggerated head, big eyes, bright colors, comic style, keep person recognizable",
        quality: "medium",
        size: "1024x1024",
      }),
    })

    const startJson = await startRes.json()

    if (!startRes.ok || !startJson.id) {
      return NextResponse.json(
        { error: "Failed to start Wavespeed job", details: startJson },
        { status: 500 }
      )
    }

    const jobId = startJson.id

    // Poll wavespeed for result
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000))

      const res = await fetch(
        `https://api.wavespeed.ai/api/v3/predictions/${jobId}/result`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      )

      const json = await res.json()

      if (json.status === "succeeded") {
        return NextResponse.json({ imageUrl: json.output?.[0] })
      }

      if (json.status === "failed") {
        return NextResponse.json({ error: "Wavespeed failed", details: json }, { status: 500 })
      }
    }

    return NextResponse.json({ error: "Timeout waiting for Wavespeed" }, { status: 500 })
  } catch (err: any) {
    console.error("CARICATURE ERROR:", err)
    return NextResponse.json({ error: err.message || "Server error" }, { status: 500 })
  }
}
