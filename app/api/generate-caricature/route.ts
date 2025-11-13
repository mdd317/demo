import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    console.log("START /api/generate-caricature")

    const form = await request.formData()
    const image = form.get("image") as File | null

    if (!image) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 })
    }

    const apiKey = process.env.STABILITY_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Missing STABILITY_API_KEY" }, { status: 500 })
    }

    const buffer = Buffer.from(await image.arrayBuffer())

    // Build form-data for Stability
    const payload = new FormData()
    payload.append("prompt",
      "Funny caricature, big head, exaggerated features, vibrant colors, comic cartoon style, keep likeness, high detail, smooth shading"
    )
    payload.append("mode", "image-to-image")
    payload.append("strength", "0.85")
    payload.append("image", new Blob([buffer], { type: image.type }), image.name)
    payload.append("output_format", "png")

    console.log("Sending request to Stability...")

    const res = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/ultra",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          Accept: "image/*",
        },
        body: payload,
      }
    )

    if (!res.ok) {
      const errText = await res.text()
      console.error("Stability error text:", errText)
      return NextResponse.json(
        { error: "Stability AI error", details: errText },
        { status: 500 }
      )
    }

    const imageBuffer = Buffer.from(await res.arrayBuffer())
    const base64 = imageBuffer.toString("base64")
    const dataUrl = `data:image/png;base64,${base64}`

    return NextResponse.json({
      imageUrl: dataUrl
    })
  } catch (err: any) {
    console.error("CARICATURE ERROR:", err)
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    )
  }
}
