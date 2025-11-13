import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const file = form.get("image") as File | null

    if (!file) {
      return NextResponse.json({ error: "Brak pliku zdjęcia" }, { status: 400 })
    }

    const key = process.env.STABILITY_API_KEY
    if (!key) {
      return NextResponse.json(
        { error: "Brak STABILITY_API_KEY w środowisku" },
        { status: 500 }
      )
    }

    // File -> Base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/image-to-image",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          Accept: "image/png",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image: base64,
          prompt:
            "cartoon caricature, colorful, exaggerated features but recognizable, clean shading, digital art",
          strength: 0.6,
          output_format: "png",
        }),
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      console.error("STABILITY API ERROR:", errText)
      return NextResponse.json(
        { error: "Stability API error: " + errText },
        { status: 500 }
      )
    }

    // Stability returns binary PNG in the body
    const imgBlob = await response.arrayBuffer()
    const resultBase64 = Buffer.from(imgBlob).toString("base64")
    const url = `data:image/png;base64,${resultBase64}`

    return NextResponse.json({ imageUrl: url })
  } catch (err: any) {
    console.error("SERVER ERROR:", err)
    return NextResponse.json(
      { error: err?.message || "Nieznany błąd serwera" },
      { status: 500 }
    )
  }
}
