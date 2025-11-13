import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    console.log("START /api/generate-caricature")

    const form = await request.formData()
    const image = form.get("image") as File | null

    if (!image) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 })
    }

    const apiKey = process.env.WAVESPEED_API_KEY
    if (!apiKey) {
      console.error("MISSING WAVESPEED_API_KEY")
      return NextResponse.json({ error: "Missing WAVESPEED_API_KEY" }, { status: 500 })
    }

    // ---- STEP 1: UPLOAD IMAGE TO WAVESPEED ----
    console.log("Uploading image to WaveSpeed...")

    const arrayBuffer = await image.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: image.type || "image/png" })

    const uploadForm = new FormData()
    uploadForm.append("file", blob, image.name || "upload.png")

    const uploadRes = await fetch(
      "https://api.wavespeed.ai/api/v3/upload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
        body: uploadForm,
      }
    )

    const uploadJson = await uploadRes.json()
    console.log("UPLOAD RESULT:", uploadJson)

    if (!uploadRes.ok || !uploadJson?.url) {
      return NextResponse.json(
        { error: "Image upload to WaveSpeed failed", details: uploadJson },
        { status: 500 }
      )
    }

    const imageUrl = uploadJson.url

    // ---- STEP 2: START GENERATION JOB ----
    console.log("Starting caricature job...")

    const startRes = await fetch(
      "https://api.wavespeed.ai/api/v3/openai/gpt-image-1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enable_base64_output: false,
          enable_sync_mode: false,

          image: imageUrl,

          prompt: "Create a funny caricature with exaggerated head, funny cartoon features, big eyes, comic style, vibrant colors, keep the face recognizable",
          quality: "medium",
          size: "1024x1024",
        }),
      }
    )

    const startJson = await startRes.json()
    console.log("START JOB RESULT:", startJson)

    if (!startRes.ok || !startJson?.id) {
      return NextResponse.json(
        { error: "WaveSpeed failed to start job", details: startJson },
        { status: 500 }
      )
    }

    const jobId = startJson.id

    // ---- STEP 3: POLL RESULT ----
    console.log("Polling for result...")

    let resultUrl = null

    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000))

      const resultRes = await fetch(
        `https://api.wavespeed.ai/api/v3/predictions/${jobId}/result`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      )

      const resultJson = await resultRes.json()
      console.log(`POLL ${i}:`, resultJson)

      if (resultJson.status === "succeeded") {
        resultUrl = resultJson.output?.[0]
        break
      }

      if (resultJson.status === "failed") {
        return NextResponse.json(
          { error: "WaveSpeed generation failed", details: resultJson },
          { status: 500 }
        )
      }
    }

    if (!resultUrl) {
      return NextResponse.json(
        { error: "WaveSpeed did not return image" },
        { status: 500 }
      )
    }

    return NextResponse.json({ imageUrl: resultUrl })
  } catch (err: any) {
    console.error("CARICATURE ERROR:", err)
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    )
  }
}
