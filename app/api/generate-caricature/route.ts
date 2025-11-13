import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const image = form.get("image") as File | null

    if (!image) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 })
    }

    const apiKey = process.env.WAVESPEED_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Missing WAVESPEED_API_KEY" }, { status: 500 })
    }

    // --- 1) Upload to WaveForms.io (free public uploader) ---
    const arrayBuffer = await image.arrayBuffer()
    const blob = new Blob([arrayBuffer], { type: image.type })

    const uploadForm = new FormData()
    uploadForm.append("file", blob, image.name)

    const uploadRes = await fetch("https://upload.waveforms.io/upload", {
      method: "POST",
      body: uploadForm,
    })

    const uploadJson = await uploadRes.json()

    if (!uploadJson?.url) {
      console.error("Upload error:", uploadJson)
      return NextResponse.json(
        { error: "Failed to upload image to public host" },
        { status: 500 }
      )
    }

    const publicImageUrl = uploadJson.url

    // --- 2) Send request to WaveSpeed ---
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
          image: publicImageUrl,
          prompt:
            "Create an exaggerated funny caricature with big head, cartoon face, vibrant colors, exaggerated features, comic style.",
          quality: "medium",
          size: "1024x1024",
        }),
      }
    )

    const startJson = await startRes.json()

    if (!startRes.ok || !startJson?.id) {
      console.error("WaveSpeed error:", startJson)
      return NextResponse.json(
        { error: "WaveSpeed failed to start job" },
        { status: 500 }
      )
    }

    const jobId = startJson.id

    // --- 3) Polling ---
    let resultUrl = null

    for (let i = 0; i < 20; i++) {
      await new Promise((r) => setTimeout(r, 2000))

      const res = await fetch(
        `https://api.wavespeed.ai/api/v3/predictions/${jobId}/result`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      )

      const json = await res.json()

      if (json.status === "succeeded") {
        resultUrl = json?.output?.[0]
        break
      }

      if (json.status === "failed") {
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

    return NextResponse.json({ imageUrl: resultUrl })
  } catch (err) {
    console.error(err)
    return NextResponse.json(
      { error: "Server error generating caricature" },
      { status: 500 }
    )
  }
}
