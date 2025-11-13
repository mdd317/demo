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
    if (!falKey) {
      return NextResponse.json({ error: "FAL_KEY is missing" }, { status: 500 })
    }

    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const uploadRes = await fetch("https://fal.run/api/v1/storage/upload", {
      method: "POST",
      headers: { Authorization: `Key ${falKey}` },
      body: buffer,
    })

    const uploadJson = await uploadRes.json()
    const imageUrl = uploadJson.url

    const response = await fetch("https://fal.run/api/v1/run/fal-ai/kandinsky-image-to-image", {
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
    })

    const data = await response.json()

    return NextResponse.json({ imageUrl: data.images[0].url })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: String(err) },
      { status: 500 },
    )
  }
}
