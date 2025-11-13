import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    console.log("START WAVESPEED")

    const form = await request.formData()
    const imageFile = form.get("image") as File | null

    if (!imageFile) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 })
    }

    const apiKey = process.env.WAVESPEED_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: "Missing WAVESPEED_API_KEY" }, { status: 500 })
    }

    // STEP 1 — upload image to Wavespeed temporary storage
    console.log("Uploading image...")

    const buffer = Buffer.from(await imageFile.arrayBuffer())

    const uploadForm = new FormData()
    uploadForm.append("file", new Blob([buffer], { type: imageFile.type }), imageFile.name)

    const uploadRes = await fetch("https://api.wavespeed.ai/api/v3/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: uploadForm,
    })

    const uploadText = await uploadRes.text()
    console.log("UPLOAD RAW:", uploadText)

    let uploadJson
    try {
      uploadJson = JSON.parse(uploadText)
    } catch {
      return NextResponse.json(
        { error: "UPLOAD returned non-JSON", raw: uploadText },
        { status: 500 }
      )
    }

    if (!uploadJson.url) {
      return NextResponse.json(
        { error: "Upload failed", details: uploadJson },
        { status: 500 }
      )
    }

    const publicImageUrl = uploadJson.url
    console.log("Uploaded:", publicImageUrl)

    // STEP 2 — start job EXACTLY like curl
    console.log("Starting job...")

    const startRes = await fetch("https://api.wavespeed.ai/api/v3/openai/gpt-image-1", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enable_base64_output: false,
        enable_sync_mode: false,
        image: publicImageUrl,
        prompt: "Become a comic style.",
        quality: "medium",
        size: "1024x1024",
      }),
    })

    const startText = await startRes.text()
    console.log("START RAW:", startText)

    let startJson
    try {
      startJson = JSON.parse(startText)
    } catch {
      return NextResponse.json(
        { error: "START returned non-JSON", raw: startText },
        { status: 500 }
      )
    }

    if (!startJson.id) {
      return NextResponse.json(
        { error: "WaveSpeed failed to start job", details: startJson },
        { status: 500 }
      )
    }

    const jobId = startJson.id

    // STEP 3 — polling
    console.log("Polling results...")

    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000))

      const pollRes = await fetch(
        `https://api.wavespeed.ai/api/v3/predictions/${jobId}/result`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        }
      )

      const pollText = await pollRes.text()
      console.log(`POLL ${i}:`, pollText)

      let pollJson
      try {
        pollJson = JSON.parse(pollText)
      } catch {
        continue
      }

      if (pollJson.status === "succeeded") {
        const imageUrl = pollJson.output?.[0]
        return NextResponse.json({ imageUrl })
      }

      if (pollJson.status === "failed") {
        return NextResponse.json(
          { error: "Job failed", details: pollJson },
          { status: 500 }
        )
      }
    }

    return NextResponse.json({ error: "Job timeout" }, { status: 500 })
  } catch (err: any) {
    console.error("CARICATURE ERROR:", err)
    return NextResponse.json(
      { error: err?.message || String(err) },
      { status: 500 }
    )
  }
}
