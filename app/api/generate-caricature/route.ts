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

    // File → base64
    const buffer = Buffer.from(await file.arrayBuffer())
    const base64 = buffer.toString("base64")

    // ✔️ POPRAWNY MODEL: flux-lora
    const falResponse = await fetch(
      "https://queue.fal.run/fal-ai/flux-lora",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Key ${falKey}`,
        },
        body: JSON.stringify({
          input: {
            image_url: `data:${file.type};base64,${base64}`,
            prompt:
              "cartoon caricature, exaggerated face, colorful, fun, recognizable person, digital art",
            lora_strength: 0.8,
            guidance: 3.5,
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

    const imageUrl = falData?.output?.image?.url

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
