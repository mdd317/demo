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

    // File -> Base64
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")

    // --- FAL.AI NEW JOB API ---
    const response = await fetch(
      "https://queue.fal.run/fal-ai/face-toonify",
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
              "cartoon caricature, exaggerated but recognizable face, colorful, fun style",
          },
        }),
      }
    )

    const result = await response.json()

    if (!response.ok) {
      console.error("FAL ERROR:", result)
      return NextResponse.json({ error: result }, { status: 500 })
    }

    const output = result?.output?.images?.[0]?.url

    if (!output) {
      return NextResponse.json(
        { error: "No image returned from fal.ai" },
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
