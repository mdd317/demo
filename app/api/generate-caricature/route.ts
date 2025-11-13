import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File | null

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const falKey = process.env.FAL_KEY

    // 🔍 DEBUG LOG – sprawdzamy, czy Vercel *naprawdę* widzi zmienną
    console.log(
      "DEBUG FAL_KEY:",
      falKey ? `PRESENT (len=${falKey.length})` : "MISSING",
    )

    if (!falKey) {
      return NextResponse.json(
        { error: "FAL_KEY is missing (env not visible in this deployment)" },
        { status: 500 },
      )
    }

    // 🔄 1) upload obrazka do storage fal.ai
    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadRes = await fetch("https://fal.run/api/v1/storage/upload", {
      method: "POST",
      headers: {
        Authorization: `Key ${falKey}`,
      },
      body: buffer,
    })

    if (!uploadRes.ok) {
      const text = await uploadRes.text()
      console.error("FAL upload error:", uploadRes.status, text)
      return NextResponse.json(
        { error: `FAL upload error (${uploadRes.status}): ${text}` },
        { status: 500 },
      )
    }

    const uploadJson = await uploadRes.json()
    const imageUrl = uploadJson.url as string | undefined

    if (!imageUrl) {
      return NextResponse.json(
        { error: "FAL upload did not return image URL" },
        { status: 500 },
      )
    }

    // 🔄 2) wywołanie modelu image-to-image (przykład: kandinsky-image-to-image)
    const response = await fetch(
      "https://fal.run/api/v1/run/fal-ai/kandinsky-image-to-image",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${falKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt:
            "Create a fun digital caricature of this person. Exaggerate facial features slightly but keep them recognizable. Cartoon, colorful, clean lines.",
          image_url: imageUrl,
          strength: 0.7,
        }),
      },
    )

    if (!response.ok) {
      const text = await response.text()
      console.error("FAL model error:", response.status, text)
      return NextResponse.json(
        { error: `FAL model error (${response.status}): ${text}` },
        { status: 500 },
      )
    }

    const data = await response.json()

    // struktura odpowiedzi zależy od modelu – w fal.ai najczęściej data.images[0].url
    const resultUrl =
      (data as any)?.images?.[0]?.url ||
      (data as any)?.image?.url ||
      null

    if (!resultUrl) {
      console.error("FAL response unexpected:", data)
      return NextResponse.json(
        { error: "FAL did not return image URL in response" },
        { status: 500 },
      )
    }

    return NextResponse.json({ imageUrl: resultUrl })
  } catch (error) {
    console.error("Caricature generation error (server):", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? `Server error: ${error.message}`
            : "Server error: unknown",
      },
      { status: 500 },
    )
  }
}
