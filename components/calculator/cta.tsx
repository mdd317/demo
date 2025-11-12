"use client"

import { useRouter } from "next/navigation"
import { useState } from "react"

export default function CalculatorCTA() {
  const router = useRouter()
  const [showPdfSuccess, setShowPdfSuccess] = useState(false)

  const handleDownloadPDF = () => {
    setShowPdfSuccess(true)
    setTimeout(() => setShowPdfSuccess(false), 3000)
  }

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#fffbf5] via-[#fffbf5]/80 to-transparent pt-12 pb-6 px-4 backdrop-blur-sm border-t border-[#ffe8d6]/30">
        <div className="max-w-[480px] mx-auto space-y-3">
          <button
            onClick={() => router.push("/contact")}
            className="w-full px-4 py-3 rounded-[14px] bg-[#ff9566] text-white font-semibold hover:bg-[#ff7f4d] transition-colors min-h-[44px]"
          >
            Umów darmową konsultację (15 min)
          </button>
          <button
            onClick={handleDownloadPDF}
            className="w-full px-4 py-3 rounded-[14px] bg-transparent text-[#ff9566] border border-[#ff9566] font-semibold hover:bg-[#ff9566]/10 transition-colors min-h-[44px]"
          >
            Pobierz PDF z wynikiem
          </button>
        </div>
      </div>

      {showPdfSuccess && (
        <div className="fixed bottom-24 left-4 right-4 max-w-[480px] mx-auto bg-[#ff9566] text-white px-4 py-3 rounded-[14px] text-sm font-medium">
          PDF przygotowany! Sprawdź folder pobierania.
        </div>
      )}
    </>
  )
}
