import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File | null

    if (!image) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 })
    }

    const imgbbKey = process.env.IMGBB_API_KEY
    const wavespeedKey = process.env.WAVESPEED_API_KEY

    if (!imgbbKey) {
      return NextResponse.json({ error: "IMGBB_API_KEY missing" }, { status: 500 })
    }
    if (!wavespeedKey) {
      return NextResponse.json({ error: "WAVESPEED_API_KEY missing" }, { status: 500 })
    }

    // ---------------------------
    // 1️⃣ Upload to IMGBB
    // ---------------------------
    const buffer = Buffer.from(await image.arrayBuffer())
    const base64 = buffer.toString("base64")

    const uploadRes = await fetch(
      `https://api.imgbb.com/1/upload?key=${imgbbKey}`,
      {
        method: "POST",
        body: new URLSearchParams({
          image: base64,
          name: `upload-${Date.now()}`,
        }),
      }
    )

    const uploadJson = await uploadRes.json()

    if (!uploadJson?.success) {
      console.error("IMGBB ERROR:", uploadJson)
      return NextResponse.json(
        { error: "Image upload failed", imgbb: uploadJson },
        { status: 500 }
      )
    }

    const publicUrl = uploadJson.data.url
    console.log("IMGBB PUBLIC URL:", publicUrl)

    // ---------------------------
    // 2️⃣ Start Wavespeed job
    // ---------------------------
    const startRes = await fetch(
      "https://api.wavespeed.ai/api/v3/openai/gpt-image-1",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${wavespeedKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          enable_base64_output: false,
          enable_sync_mode: false,

          image: publicUrl,

          prompt:
            "Funny digital caricature, exaggerated head, cartoon humor, big expressions, vibrant colors, comic style, recognisable face",
          quality: "medium",
          size: "1024x1024",
        }),
      }
    )

    const startJson = await startRes.json()

    if (!startRes.ok || !startJson?.id) {
      console.error("WAVESPEED START ERROR:", startJson)
      return NextResponse.json(
        { error: "Failed to start Wavespeed job", wavespeed: startJson },
        { status: 500 }
      )
    }

    const jobId = startJson.id

    // ---------------------------
    // 3️⃣ Poll for result
    // ---------------------------
    for (let i = 0; i < 30; i++) {
      await new Promise((r) => setTimeout(r, 2000))

      const resultRes = await fetch(
        `https://api.wavespeed.ai/api/v3/predictions/${jobId}/result`,
        {
          headers: { Authorization: `Bearer ${wavespeedKey}` },
        }
      )

      const resultJson = await resultRes.json()

      if (resultJson.status === "succeeded") {
        return NextResponse.json({ imageUrl: resultJson.output?.[0] })
      }

      if (resultJson.status === "failed") {
        return NextResponse.json(
          { error: "Wavespeed failed", details: resultJson },
          { status: 500 }
        )
      }
    }

    return NextResponse.json(
      { error: "Timeout waiting for Wavespeed result" },
      { status: 500 }
    )
  } catch (err: any) {
    console.error("CARICATURE ERROR:", err)
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    )
  }
}
