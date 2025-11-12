"use client"

import { useState, useCallback, useMemo } from "react"
import CalculatorInputs from "@/components/calculator/inputs"
import CalculatorResults from "@/components/calculator/results"
import CalculatorAssumptions from "@/components/calculator/assumptions"
import CalculatorCTA from "@/components/calculator/cta"

interface CalculatorState {
  currency: "PLN" | "USD"
  rate: number
  ht: number
  mc: number
  n: number
  w: number
  tasks: number
  rt: number
  rc: number
  mt: number
  advancedOpen: boolean
}

export default function KalkulatorPage() {
  const [state, setState] = useState<CalculatorState>({
    currency: "PLN",
    rate: 200,
    ht: 6.7,
    mc: 8,
    n: 3,
    w: 40,
    tasks: 30,
    rt: 1.8,
    rc: 86,
    mt: 0.15,
    advancedOpen: false,
  })

  const handleInputChange = useCallback((field: keyof CalculatorState, value: any) => {
    setState((prev) => ({ ...prev, [field]: value }))
  }, [])

  // ... existing calculation logic ...
  const calculations = useMemo(() => {
    const w_pct = state.w / 100
    const HT = state.ht
    const HC = state.rate * state.ht

    const be_cost = (state.mc + state.rc) / Math.max(HC, 0.000001)
    const be_time = (state.mt + state.rt) / Math.max(HT, 0.000001)

    const T1 = state.mt + state.rt + (1 - w_pct) * HT
    const C1 = state.mc + state.rc + (1 - w_pct) * HC
    const save_time_1 = HT - T1
    const save_cost_1 = HC - C1
    const monthly_human = HC * state.tasks
    const monthly_1 = C1 * state.tasks
    const monthly_save_1 = monthly_human - monthly_1

    const factor = (1 - Math.pow(1 - w_pct, state.n)) / Math.max(w_pct, 0.000001)
    const Tn = (state.mt + state.rt) * factor + Math.pow(1 - w_pct, state.n) * HT
    const Cn = (state.mc + state.rc) * factor + Math.pow(1 - w_pct, state.n) * HC
    const save_time_n = HT - Tn
    const save_cost_n = HC - Cn
    const monthly_n = Cn * state.tasks
    const monthly_save_n = monthly_human - monthly_n

    return {
      HT,
      HC,
      be_cost: Math.max(0, Math.min(100, be_cost * 100)),
      be_time: Math.max(0, Math.min(100, be_time * 100)),
      save_time_1,
      save_cost_1,
      monthly_save_1,
      save_time_n,
      save_cost_n,
      monthly_save_n,
      monthly_human,
    }
  }, [state])

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#fffbf5] to-[#fff5ed]">
      <div className="sticky top-0 z-10 bg-gradient-to-b from-[#fffbf5] to-transparent backdrop-blur-sm py-6 px-4 border-b border-[#ffe8d6]/50">
        <div className="max-w-[480px] mx-auto">
          <h1 className="text-[#3d2817] text-2xl font-bold mb-2">Policz, ile możesz zyskać z AI</h1>
          <p className="text-[#9b8b75] text-sm mb-3">Model inspirowany GDPval: realne zadania, realne stawki.</p>
          <button
            onClick={() => {
              const elem = document.getElementById("assumptions")
              elem?.scrollIntoView({ behavior: "smooth" })
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full border border-[#ff9566] text-[#ff9566] text-xs font-medium hover:bg-[#ff9566]/10 transition-colors"
          >
            Jak to liczymy?
          </button>
        </div>
      </div>

      <div className="max-w-[480px] mx-auto px-4 py-6 space-y-6 pb-40">
        <CalculatorInputs state={state} onInputChange={handleInputChange} />
        <CalculatorResults calculations={calculations} state={state} />
        <CalculatorAssumptions />
      </div>

      <CalculatorCTA />
    </main>
  )
}
