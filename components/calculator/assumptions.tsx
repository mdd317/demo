"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function CalculatorAssumptions() {
  const [open, setOpen] = useState(false)

  return (
    <section id="assumptions" className="space-y-3">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-white rounded-[14px] border border-[#ffe8d6] hover:border-[#ff9566] transition-colors text-left group"
      >
        <h2 className="text-[#3d2817] font-semibold">Założenia (GDPval)</h2>
        <ChevronDown
          size={20}
          className={`text-[#ff9566] transition-transform group-hover:text-[#ff7f4d] ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="bg-white rounded-[14px] p-5 border border-[#ffe8d6] shadow-sm space-y-4">
          <div>
            <h3 className="text-[#3d2817] font-semibold mb-2">Skąd te liczby?</h3>
            <p className="text-[#9b8b75] text-sm">
              Metodologia opiera się na badaniu OpenAI GDPval, które sprawdza, czy AI może wykonywać realne zadania
              warte pieniądze — takie, które na co dzień robią pracownicy w różnych zawodach.
            </p>
          </div>

          <div>
            <h4 className="text-[#3d2817] font-semibold mb-3 text-sm">Podstawowe pojęcia (prosto):</h4>
            <ul className="space-y-2">
              <li className="text-[#9b8b75] text-sm flex gap-2">
                <span className="text-[#ff9566] flex-shrink-0">•</span>
                <span>
                  <strong className="text-[#3d2817]">HT (Human Time)</strong> — ile godzin ekspert potrzebuje na zadanie
                  (w badaniu zwykle 7–9 h).
                </span>
              </li>
              <li className="text-[#9b8b75] text-sm flex gap-2">
                <span className="text-[#ff9566] flex-shrink-0">•</span>
                <span>
                  <strong className="text-[#3d2817]">HC (Human Cost)</strong> — koszt pracy eksperta = stawka × HT.
                </span>
              </li>
              <li className="text-[#9b8b75] text-sm flex gap-2">
                <span className="text-[#ff9566] flex-shrink-0">•</span>
                <span>
                  <strong className="text-[#3d2817]">MT (Model Time)</strong> — czas jednego przebiegu AI
                  (sekundy–minuty).
                </span>
              </li>
              <li className="text-[#9b8b75] text-sm flex gap-2">
                <span className="text-[#ff9566] flex-shrink-0">•</span>
                <span>
                  <strong className="text-[#3d2817]">MC (Model Cost)</strong> — koszt jednego przebiegu AI (np. API).
                </span>
              </li>
              <li className="text-[#9b8b75] text-sm flex gap-2">
                <span className="text-[#ff9566] flex-shrink-0">•</span>
                <span>
                  <strong className="text-[#3d2817]">RT/RC (Review)</strong> — czas i koszt sprawdzenia wyników AI przez
                  człowieka.
                </span>
              </li>
              <li className="text-[#9b8b75] text-sm flex gap-2">
                <span className="text-[#ff9566] flex-shrink-0">•</span>
                <span>
                  <strong className="text-[#3d2817]">Win rate (w)</strong> — w ilu przypadkach wynik AI jest
                  wystarczająco dobry bez pełnej poprawki.
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#3d2817] font-semibold mb-3 text-sm">Dlaczego to działa?</h4>
            <ul className="space-y-2">
              <li className="text-[#9b8b75] text-sm flex gap-2">
                <span className="text-[#ff9566] flex-shrink-0">•</span>
                <span>Gdy w jest wysokie, AI + review jest szybsze i tańsze niż praca od zera.</span>
              </li>
              <li className="text-[#9b8b75] text-sm flex gap-2">
                <span className="text-[#ff9566] flex-shrink-0">•</span>
                <span>Nawet przy niższym w opłaca się dać modelowi kilka prób (Try n×).</span>
              </li>
              <li className="text-[#9b8b75] text-sm flex gap-2">
                <span className="text-[#ff9566] flex-shrink-0">•</span>
                <span>W GDPval AI dorównywało lub przewyższało ekspertów w ok. połowie zadań.</span>
              </li>
            </ul>
          </div>

          <div className="pt-2 border-t border-[#ffe8d6]">
            <p className="text-[#9b8b75] text-xs">
              Domyślne wartości odzwierciedlają GDPval (orientacyjnie): HT≈6.7 h, HC≈$361; RT≈1.8 h, RC≈$86. Dostosuj do
              realiów Twojej firmy.
            </p>
          </div>
        </div>
      )}
    </section>
  )
}
