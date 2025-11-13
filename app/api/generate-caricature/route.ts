import { NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    const form = await request.formData()
    const file = form.get("image") as File | null

    if (!file) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    const falKey = process.env.FAL_KEY
    if (!falKey) {
      return NextResponse.json({ error: "FAL_KEY is missing" }, { status: 500 })
    }

    // Convert File → Base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")

    // REST request to fal.ai (NO install required)
    const response = await fetch(
      "https://api.fal.ai/v1/run/fal-ai/face-toonify",
      {
        method: "POST",
        headers: {
          Authorization: `Key ${falKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: {
            image_base64: base64,
            prompt:
              "cartoon caricature, exaggerated but recognizable face, fun style, colorful",
          },
        }),
      }
    )

    if (!response.ok) {
      const text = await response.text()
      console.error("FAL error:", text)
      return NextResponse.json({ error: text }, { status: 500 })
    }

    const data = await response.json()

    const output = data?.data?.images?.[0]?.url
    if (!output) {
      return NextResponse.json(
        { error: "No image returned from FAL" },
        { status: 500 }
      )
    }

    return NextResponse.json({ imageUrl: output })
  } catch (err) {
    console.error("Server error:", err)
    return NextResponse.json(
      { error: `Server failed: ${String(err)}` },
      { status: 500 }
    )
  }
}
