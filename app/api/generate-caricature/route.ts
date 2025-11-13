import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const file = form.get("image") as File | null

    if (!file) {
      return NextResponse.json({ error: "Brak pliku zdjęcia" }, { status: 400 })
    }

    const falKey = process.env.FAL_KEY
    if (!falKey) {
      return NextResponse.json(
        { error: "Brak FAL_KEY w zmiennych środowiskowych" },
        { status: 500 }
      )
    }

    // File → Base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")

    // 🔥 POPRAWNY MODEL: real-cartoonizer
    const falResponse = await fetch(
      "https://queue.fal.run/fal-ai/real-cartoonizer",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${falKey}`,
        },
        body: JSON.stringify({
          input: {
            image: `data:${file.type};base64,${base64}`,
            prompt: "fun caricature, exaggerated face but recognizable",
          },
        }),
      }
    )

    const falData = await falResponse.json()

    if (!falResponse.ok) {
      console.error("FAL API ERROR:", falData)
      return NextResponse.json(
        {
          error:
            falData?.error?.message ||
            falData?.detail ||
            "Nieznany błąd fal.ai",
        },
        { status: 500 }
      )
    }

    const imageUrl = falData?.output?.image?.url

    if (!imageUrl) {
      return NextResponse.json(
        { error: "fal.ai nie zwróciło zdjęcia" },
        { status: 500 }
      )
    }

    return NextResponse.json({ imageUrl })
  } catch (error: any) {
    console.error("SERVER ERROR:", error)
    return NextResponse.json(
      { error: error?.message || "Nieznany błąd serwera" },
      { status: 500 }
    )
  }
}
