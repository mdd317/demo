import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const image = form.get("image") as File | null

    if (!image) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 })
    }

    if (!process.env.WAVESPEED_API_KEY) {
      return NextResponse.json({ error: "Missing WAVESPEED_API_KEY" }, { status: 500 })
    }

    // 1) Convert uploaded file → base64 URL
    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString("base64")
    const dataUrl = `data:${image.type};base64,${base64}`

    // 2) Send request to WaveSpeed (async mode)
    const start = await fetch(
      "https://api.wavespeed.ai/api/v3/openai/gpt-image-1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.WAVESPEED_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enable_base64_output: false,
          enable_sync_mode: false,
          image: dataUrl,
          prompt: "Make a funny, exaggerated cartoon caricature. Big head, funny style.",
          quality: "medium",
          size: "auto",
        }),
      }
    )

    const startJson = await start.json()

    if (!start.ok || !startJson?.id) {
      console.error("WaveSpeed start error:", startJson)
      return NextResponse.json(
        { error: "WaveSpeed failed to start job" },
        { status: 500 }
      )
    }

    const requestId = startJson.id

    // 3) Polling: wait for the result
    let resultUrl = null

    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 2000)) // wait 2 sec

      const resultReq = await fetch(
        `https://api.wavespeed.ai/api/v3/predictions/${requestId}/result`,
        {
          headers: {
            Authorization: `Bearer ${process.env.WAVESPEED_API_KEY}`,
          },
        }
      )

      const resultJson = await resultReq.json()

      if (resultJson?.status === "succeeded") {
        resultUrl = resultJson?.output?.[0]
        break
      }

      if (resultJson?.status === "failed") {
        return NextResponse.json(
          { error: "WaveSpeed generation failed" },
          { status: 500 }
        )
      }
    }

    if (!resultUrl) {
      return NextResponse.json(
        { error: "WaveSpeed did not return an image" },
        { status: 500 }
      )
    }

    // 4) Return final image URL to frontend
    return NextResponse.json({ imageUrl: resultUrl })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json(
      { error: "Server error generating caricature" },
      { status: 500 }
    )
  }
}
