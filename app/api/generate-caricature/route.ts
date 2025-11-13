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
      return NextResponse.json({ error: "STABILITY_API_KEY nie ustawiony" }, { status: 500 })
    }

    const imageBuffer = Buffer.from(await file.arrayBuffer())

    // Tworzymy multipart/form-data dla Stability
    const apiForm = new FormData()
    apiForm.append(
      "image",
      new Blob([imageBuffer], { type: file.type }),
      "input.jpg"
    )
    apiForm.append(
      "prompt",
      "fun caricature portrait, cartoon face, exaggerated but recognizable features, clean digital style"
    )
    apiForm.append("output_format", "jpeg")

    const response = await fetch(
      "https://api.stability.ai/v2beta/stable-image/generate/sd3",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          Accept: "image/*",
        },
        body: apiForm,
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      return NextResponse.json(
        { error: "Stability API error: " + errText },
        { status: 500 }
      )
    }

    // Zwraca BINARNY obraz → konwertujemy na Base64
    const arrayBuf = await response.arrayBuffer()
    const base64 = Buffer.from(arrayBuf).toString("base64")
    const url = `data:image/jpeg;base64,${base64}`

    return NextResponse.json({ imageUrl: url })
  } catch (e: any) {
    return NextResponse.json(
      { error: e?.message ?? "Nieznany błąd serwera" },
      { status: 500 }
    )
  }
}
