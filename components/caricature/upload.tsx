"use client"

import type React from "react"

import { useRef, useState } from "react"
import { Upload } from "lucide-react"

interface UploadProps {
  onImageSelect: (file: File) => void
  uploadedImage: File | null
}

export default function CaricatureUpload({ onImageSelect, uploadedImage }: UploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      onImageSelect(file)
      const reader = new FileReader()
      reader.onload = (e) => setPreview(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.add("border-[#ff9566]", "bg-[#ff9566]/5")
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove("border-[#ff9566]", "bg-[#ff9566]/5")
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.currentTarget.classList.remove("border-[#ff9566]", "bg-[#ff9566]/5")
    const file = e.dataTransfer.files[0]
    if (file) handleFileChange(file)
  }

  return (
    <div className="bg-white rounded-[14px] p-6 border border-[#ffe8d6] shadow-sm">
      <h2 className="text-[#3d2817] text-lg font-semibold mb-1">2. Wgraj swoje zdjęcie</h2>
      <p className="text-[#9b8b75] text-sm mb-6">Najlepiej portret z dobrze widoczną twarzą.</p>

      {!preview ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-[#ffe8d6] rounded-[14px] p-8 text-center cursor-pointer hover:border-[#ff9566]/50 transition-colors bg-[#fffbf5]/50"
        >
          <Upload size={32} className="mx-auto text-[#ff9566] mb-3" />
          <p className="text-[#3d2817] font-medium mb-1">
            Przeciągnij i upuść zdjęcie tutaj lub kliknij, aby wybrać plik.
          </p>
          <p className="text-[#9b8b75] text-xs">Obsługiwane formaty: JPG, PNG. Max 10 MB.</p>
        </div>
      ) : (
        <div className="space-y-4">
          <img
            src={preview || "/placeholder.svg"}
            alt="Podgląd wgranego zdjęcia"
            className="w-full h-48 object-cover rounded-[14px] border border-[#ffe8d6]"
          />
          <div className="text-sm text-[#9b8b75]">
            <p>
              <strong className="text-[#3d2817]">{uploadedImage?.name}</strong>
            </p>
            <p>{(uploadedImage?.size || 0 / 1024 / 1024).toFixed(2)} MB</p>
          </div>
          <button
            onClick={() => {
              fileInputRef.current?.click()
              setPreview(null)
            }}
            className="text-[#ff9566] text-sm font-medium hover:underline"
          >
            Zmień zdjęcie
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFileChange(file)
        }}
        className="hidden"
      />
    </div>
  )
}
