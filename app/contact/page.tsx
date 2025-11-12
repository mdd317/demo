"use client"

import { useRouter } from "next/navigation"

export default function ContactPage() {
  const router = useRouter()

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0A0F0F] to-[#101A1A] flex items-center justify-center px-4">
      <div className="w-full max-w-[480px] space-y-6">
        <button onClick={() => router.back()} className="text-[#19C6C6] text-sm font-medium hover:underline">
          ← Wróć
        </button>

        <div className="bg-[#121C1C] rounded-[14px] p-6 border border-[#243030] shadow-sm">
          <h1 className="text-[#EAF0F0] text-2xl font-bold mb-2">Umów konsultację</h1>
          <p className="text-[#9AAEAE] mb-6">Chętnie opowiemy Ci o możliwościach AI dla Twojej firmy.</p>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault()
              alert("Dziękujemy! Wkrótce się z Tobą skontaktujemy.")
            }}
          >
            <div>
              <label className="block text-[#EAF0F0] text-sm font-medium mb-2">Imię i nazwisko</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 rounded-[14px] bg-[#0A0F0F] text-[#EAF0F0] border border-[#243030] focus:outline-none focus:ring-2 focus:ring-[#19C6C6] text-sm"
              />
            </div>

            <div>
              <label className="block text-[#EAF0F0] text-sm font-medium mb-2">Adres e-mail</label>
              <input
                type="email"
                required
                className="w-full px-3 py-2 rounded-[14px] bg-[#0A0F0F] text-[#EAF0F0] border border-[#243030] focus:outline-none focus:ring-2 focus:ring-[#19C6C6] text-sm"
              />
            </div>

            <div>
              <label className="block text-[#EAF0F0] text-sm font-medium mb-2">Wiadomość</label>
              <textarea
                rows={4}
                className="w-full px-3 py-2 rounded-[14px] bg-[#0A0F0F] text-[#EAF0F0] border border-[#243030] focus:outline-none focus:ring-2 focus:ring-[#19C6C6] text-sm resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 rounded-[14px] bg-[#19C6C6] text-[#0A0F0F] font-semibold hover:bg-[#14A1A1] transition-colors min-h-[44px]"
            >
              Wyślij wiadomość
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
