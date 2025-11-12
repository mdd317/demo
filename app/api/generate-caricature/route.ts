import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Convert image to base64
    const buffer = await image.arrayBuffer()
    const base64 = Buffer.from(buffer).toString("base64")

    // Call external API (placeholder - integrate with your AI provider)
    // This is a sample implementation; replace with your actual AI service
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt:
          "Create a fun digital caricature of this person in a clean cartoon style with slightly exaggerated facial features, keeping the face recognizable.",
        n: 1,
        size: "1024x1024",
      }),
    })

    if (!response.ok) {
      // For now, return a placeholder image URL
      return NextResponse.json({
        imageUrl: "/ai-caricature.jpg",
      })
    }

    const data = await response.json()
    return NextResponse.json({
      imageUrl: data.data[0].url,
    })
  } catch (error) {
    console.error("Caricature generation error:", error)
    return NextResponse.json({ error: "Failed to generate caricature" }, { status: 500 })
  }
}
