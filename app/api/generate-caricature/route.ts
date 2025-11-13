import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get("image") as File | null

    if (!file) {
      return NextResponse.json({ error: "Brak zdjęcia" }, { status: 400 })
    }

    const key = process.env.STABILITY_API_KEY
    if (!key) {
      return NextResponse.json(
        { error: "STABILITY_API_KEY nie jest ustawiony" },
        { status: 500 }
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const apiForm = new FormData()

    // Image → Image
    apiForm.append(
      "image",
      new Blob([buffer], { type: file.type }),
      "input.webp"
    )

    // ⭐ Cartoon, Pixar-like caricature prompt
    apiForm.append(
      "prompt",
      `
      high quality cartoon caricature portrait of this person, clean outlines,
      vivid colors, smooth shading, exaggerated facial features but still recognizable,
      professional digital illustration, crisp, charming, fun
      `
    )

    apiForm.append("strength", "0.65")
    apiForm.append("output_format", "webp")

    // Accept binary WebP
    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/ultra",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          Accept: "image/*",
        },
        body: apiForm,
      }
    )

    const bufferResp = await response.arrayBuffer()

    if (!response.ok) {
      const text = Buffer.from(bufferResp).toString()
      return NextResponse.json(
        { error: "Stability API error: " + text },
        { status: 500 }
      )
    }

    // Convert to base64 for frontend
    const b64 = Buffer.from(bufferResp).toString("base64")
    const url = `data:image/webp;base64,${b64}`

    return NextResponse.json({ imageUrl: url })
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || "Nieznany błąd" },
      { status: 500 }
    )
  }
}
