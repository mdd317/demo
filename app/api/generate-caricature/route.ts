import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const form = await request.formData()
    const image = form.get("image") as File | null

    if (!image) {
      return NextResponse.json({ error: "Brak obrazu" }, { status: 400 })
    }

    const apiKey = process.env.WAVESPEED_API_KEY
    const imgbbKey = process.env.IMGBB_API_KEY

    if (!apiKey) return NextResponse.json({ error: "Brak WAVESPEED_API_KEY" }, { status: 500 })
    if (!imgbbKey) return NextResponse.json({ error: "Brak IMGBB_API_KEY" }, { status: 500 })

    // 1) obraz -> base64
    const buffer = Buffer.from(await image.arrayBuffer())
    const base64 = buffer.toString("base64")

    // 2) upload do IMGBB
    const uploadRes = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ image: base64 }),
    })

    const uploadJson = await uploadRes.json()
    console.log("IMGBB:", uploadJson)

    if (!uploadJson?.data?.url) {
      return NextResponse.json(
        { error: "Upload to IMGBB failed", details: uploadJson },
        { status: 500 },
      )
    }

    const publicUrl = uploadJson.data.url
    console.log("PUBLIC IMG URL:", publicUrl)

    // 3) START WAVESPEED JOB – TEN ENDPOINT, KTÓRY CHCESZ
    const startRes = await fetch("https://api.wavespeed.ai/api/v3/openai/gpt-image-1", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        enable_base64_output: false,
        enable_sync_mode: false,   // async + polling
        image: publicUrl,
        prompt: "Funny exaggerated cartoon caricature, big head, caricature style, vibrant colors",
        quality: "medium",
        // wg tabelki w docs: auto / 1024*1024 / 1024*1536 / 1536*1024
        size: "auto",
      }),
    })

    const startJson = await startRes.json()
    console.log("WAVESPEED START:", startRes.status, startJson)

    // *** TU JEST KLUCZ: data.id, nie id ***
    const jobId = startJson?.data?.id

    if (!startRes.ok || !jobId) {
      return NextResponse.json(
        {
          error: "Failed to start Wavespeed job",
          details: startJson,
        },
        { status: 500 },
      )
    }

    // 4) POLL WAVESPEED – status i output siedzą w data.*
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 2000))

      const pollRes = await fetch(
        `https://api.wavespeed.ai/api/v3/predictions/${jobId}/result`,
        {
          headers: { Authorization: `Bearer ${apiKey}` },
        },
      )

      const pollJson = await pollRes.json()
      console.log(`WAVESPEED POLL ${i}:`, pollRes.status, pollJson)

      const status = pollJson?.data?.status

      if (status === "completed") {
        const outUrl = pollJson?.data?.outputs?.[0]
        if (!outUrl) {
          return NextResponse.json(
            { error: "Wavespeed completed but no output URL", details: pollJson },
            { status: 500 },
          )
        }
        return NextResponse.json({ imageUrl: outUrl })
      }

      if (status === "failed") {
        return NextResponse.json(
          { error: "Wavespeed failed", details: pollJson },
          { status: 500 },
        )
      }
    }

    return NextResponse.json(
      { error: "Timeout waiting for Wavespeed" },
      { status: 500 },
    )
  } catch (err: any) {
    console.error("CARICATURE ERROR:", err)
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 },
    )
  }
}
