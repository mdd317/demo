"use client"

import { useState } from "react"
import CaricatureEmailInput from "@/components/caricature/email-input"
import CaricatureUpload from "@/components/caricature/upload"
import CaricatureGenerator from "@/components/caricature/generator"
import CaricatureEmail from "@/components/caricature/email"
import CaricatureInfo from "@/components/caricature/info"

export default function KarykaturyPage() {
  const [email, setEmail] = useState("")
  const [uploadedImage, setUploadedImage] = useState<File | null>(null)
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fffbf5] to-[#fff5ed]">
      <div className="bg-gradient-to-b from-[#fffbf5] to-transparent backdrop-blur-sm py-6 px-4 border-b border-[#ffe8d6]/50">
        <div className="max-w-[480px] mx-auto">
          <h1 className="text-[#3d2817] text-2xl font-bold">Karykatury AI</h1>
          <p className="text-[#9b8b75] text-sm mt-1">Wgraj zdjęcie i zobacz siebie w wersji karykaturze</p>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-4 py-6 space-y-6">
        <CaricatureEmailInput onEmailChange={setEmail} initialEmail={email} />
        <CaricatureUpload onImageSelect={setUploadedImage} uploadedImage={uploadedImage} />
        <CaricatureGenerator
          uploadedImage={uploadedImage}
          generatedUrl={generatedUrl}
          onGenerate={setGeneratedUrl}
          loading={loading}
          setLoading={setLoading}
          error={error}
          setError={setError}
        />
        {generatedUrl && <CaricatureEmail generatedUrl={generatedUrl} />}
        <CaricatureInfo />
      </div>
    </main>
  )
}
