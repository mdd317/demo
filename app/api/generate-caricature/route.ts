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
        { error: "Brak FAL_KEY w środowisku Vercel" },
        { status: 500 }
      )
    }

    // File → Base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")

    // ✔️ NOWY, DZIAŁAJĄCY MODEL
    const falResponse = await fetch(
      "https://queue.fal.run/fal-ai–official/animagine-xl-3.1",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${falKey}`,
        },
        body: JSON.stringify({
          input: {
            image: `data:${file.type};base64,${base64}`,
            prompt:
              "caricature, cartoon style, exaggerated facial features but recognizable person, colorful, fun",
            strength: 0.55,
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
            "fal.ai zwróciło błąd",
        },
        { status: 500 }
      )
    }

    // ✔️ POPRAWNY OUTPUT
    const imageUrl = falData?.output?.images?.[0]?.url

    if (!imageUrl) {
      return NextResponse.json(
        { error: "fal.ai nie zwróciło wygenerowanego obrazu" },
        { status: 500 }
      )
    }

    return NextResponse.json({ imageUrl })
  } catch (err: any) {
    console.error("SERVER ERROR:", err)
    return NextResponse.json(
      { error: err?.message || "Nieznany błąd serwera" },
      { status: 500 }
    )
  }
}
