import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs" // potrzebne, żeby mieć Buffer i process.env

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const image = formData.get("image") as File | null

    if (!image) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY is not set on the server" },
        { status: 500 },
      )
    }

    // Zamiana File -> Buffer
    const arrayBuffer = await image.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // Budujemy form-data dla OpenAI (image edit)
    const apiForm = new FormData()
    apiForm.append("model", "gpt-image-1") // albo "dall-e-2" jeśli wolisz
    apiForm.append(
      "image",
      new Blob([buffer], { type: image.type || "image/png" }),
      "input.png",
    )
    apiForm.append(
      "prompt",
      "Create a fun digital caricature of this person in a clean cartoon style with slightly exaggerated facial features, keeping the face recognizable.",
    )
    apiForm.append("size", "1024x1024")
    apiForm.append("response_format", "b64_json")

    const response = await fetch("https://api.openai.com/v1/images/edits", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        // UWAGA: NIE ustawiamy tu Content-Type – fetch zrobi to sam dla FormData
      },
      body: apiForm,
    })

    if (!response.ok) {
      const text = await response.text()
      console.error("OpenAI error:", response.status, text)
      return NextResponse.json(
        { error: "Failed to generate caricature from OpenAI" },
        { status: 500 },
      )
    }

    const data = await response.json()

    // OpenAI zwraca base64 w data[0].b64_json
    const b64 = data?.data?.[0]?.b64_json as string | undefined

    if (!b64) {
      return NextResponse.json(
        { error: "No image returned from OpenAI" },
        { status: 500 },
      )
    }

    const imageUrl = `data:image/png;base64,${b64}`

    return NextResponse.json({ imageUrl })
  } catch (error) {
    console.error("Caricature generation error:", error)
    return NextResponse.json(
      { error: "Failed to generate caricature" },
      { status: 500 },
    )
  }
}
