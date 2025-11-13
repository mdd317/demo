"use client"

import { useState } from "react"

interface EmailProps {
  generatedUrl: string
}

export default function CaricatureEmail({ generatedUrl }: EmailProps) {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleSendEmail = async () => {
    if (!validateEmail(email)) {
      setStatus("error")
      setMessage("Wpisz poprawny adres e-mail")
      return
    }

    setLoading(true)
    setStatus("idle")

    try {
      const response = await fetch("/api/send-caricature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          caricatureUrl: generatedUrl,
        }),
      })

      if (!response.ok) {
        throw new Error("Nie udało się wysłać e-maila")
      }

      setStatus("success")
      setMessage("Wysłano! Sprawdź swoją skrzynkę e-mail.")
      setEmail("")
    } catch (err) {
      setStatus("error")
      setMessage(err instanceof Error ? err.message : "Coś poszło nie tak")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-[14px] p-6 border border-[#ffe8d6] shadow-sm">
      <h2 className="text-[#3d2817] text-lg font-semibold mb-1">3. Wyślij na e-mail</h2>
      <p className="text-[#9b8b75] text-sm mb-6">Podaj adres e-mail, na który mamy wysłać Twoją karykaturę.</p>

      <div className="space-y-4">
        {status !== "idle" && (
          <div
            className={`rounded-[14px] p-4 ${
              status === "success"
                ? "bg-green-100 border border-green-300 text-green-700"
                : "bg-red-100 border border-red-300 text-red-700"
            }`}
          >
            <p className="font-semibold text-sm">{status === "success" ? "Wysłano!" : "Błąd"}</p>
            <p className="text-xs mt-1">{message}</p>
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-[#3d2817] text-sm font-medium mb-2">
            Adres e-mail
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="twoj.adres@email.com"
            className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] text-[#3d2817] border border-[#ffe8d6] focus:outline-none focus:ring-2 focus:ring-[#ff9566] text-sm placeholder-[#9b8b75]"
          />
        </div>

        <button
          onClick={handleSendEmail}
          disabled={!email || loading}
          className="w-full px-4 py-3 rounded-[14px] bg-[#ff9566] text-white font-semibold hover:bg-[#ff7f4d] disabled:bg-[#9b8b75] disabled:cursor-not-allowed transition-colors min-h-[44px]"
        >
          {loading ? "Wysyłanie..." : "Wyślij karykaturę na e-mail"}
        </button>
      </div>
    </div>
  )
}
