"use client"

import { Loader } from "lucide-react"

interface GeneratorProps {
  uploadedImage: File | null
  generatedUrl: string | null
  onGenerate: (url: string) => void
  loading: boolean
  setLoading: (loading: boolean) => void
  error: string | null
  setError: (error: string | null) => void
}

export default function CaricatureGenerator({
  uploadedImage,
  generatedUrl,
  onGenerate,
  loading,
  setLoading,
  error,
  setError,
}: GeneratorProps) {
  const handleGenerate = async () => {
    if (!uploadedImage) return

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("image", uploadedImage)

      const response = await fetch("/api/generate-caricature", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        // 🔍 debug: spróbujmy wyciągnąć konkretny komunikat z backendu
        let message = `Nie udało się wygenerować karykatury (status ${response.status})`

        try {
          const errorData = await response.json().catch(() => null)
          if (errorData && typeof errorData === "object" && "error" in errorData) {
            message = `Błąd serwera: ${String((errorData as any).error)}`
          } else {
            const text = await response.text().catch(() => "")
            if (text) {
              message = `Błąd serwera: ${text}`
            }
          }
        } catch (e) {
          console.error("Error parsing error response:", e)
        }

        throw new Error(message)
      }

      const data = await response.json()
      console.log("Caricature API response:", data)
      onGenerate(data.imageUrl)
    } catch (err) {
      console.error("Caricature generate error (frontend):", err)
      setError(err instanceof Error ? err.message : "Coś poszło nie tak")
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedUrl) return
    try {
      const response = await fetch(generatedUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "caricature.png"
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Download failed:", err)
    }
  }

  return (
    <div className="bg-white rounded-[14px] p-6 border border-[#ffe8d6] shadow-sm">
      <h2 className="text-[#3d2817] text-lg font-semibold mb-1">3. Wygeneruj karykaturę</h2>
      <p className="text-[#9b8b75] text-sm mb-6">
        Używamy modelu AI, który tworzy karykatury na podstawie Twojego zdjęcia.
      </p>

      {error && (
        <div className="bg-red-100 border border-red-300 rounded-[14px] p-4 mb-6">
          <h3 className="text-red-700 font-semibold mb-1">Coś poszło nie tak</h3>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={handleGenerate}
          disabled={!uploadedImage || loading}
          className="w-full px-4 py-3 rounded-[14px] bg-[#ff9566] text-white font-semibold hover:bg-[#ff7f4d] disabled:bg-[#9b8b75] disabled:cursor-not-allowed transition-colors min-h-[44px] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <Loader size={18} className="animate-spin" />
              Generowanie...
            </>
          ) : (
            "Wygeneruj karykaturę"
          )}
        </button>

        <div className="bg-[#fffbf5] rounded-[14px] p-6 min-h-[200px] flex items-center justify-center border border-[#ffe8d6]">
          {generatedUrl ? (
            <div className="space-y-4 w-full">
              <img
                src={generatedUrl || "/placeholder.svg"}
                alt="Podgląd wygenerowanej karykatury"
                className="w-full h-48 object-cover rounded-[14px] border border-[#ffe8d6]"
              />
              <p className="text-[#9b8b75] text-xs text-center">Twoja karykatura wygenerowana przez AI.</p>
              <div className="flex gap-2">
                <button
                  onClick={handleDownload}
                  className="flex-1 px-3 py-2 rounded-[10px] border border-[#ff9566] text-[#ff9566] text-sm font-medium hover:bg-[#ff9566]/10 transition-colors"
                >
                  Pobierz
                </button>
                <button
                  onClick={handleGenerate}
                  disabled={loading}
                  className="flex-1 px-3 py-2 rounded-[10px] bg-transparent text-[#ff9566] text-sm font-medium hover:text-[#ff7f4d] disabled:opacity-50 transition-colors"
                >
                  Wygeneruj ponownie
                </button>
              </div>
            </div>
          ) : (
            <p className="text-[#9b8b75] text-center">Tutaj pojawi się Twoja karykatura.</p>
          )}
        </div>
      </div>
    </div>
  )
}
