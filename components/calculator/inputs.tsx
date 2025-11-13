"use client"
import { ChevronDown } from "lucide-react"

interface CalculatorState {
  currency: "PLN" | "USD"
  rate: number | ""
  ht: number | ""
  mc: number | ""
  n: number
  w: number
  tasks: number | ""
  rt: number | ""
  rc: number | ""
  mt: number | ""
  advancedOpen: boolean
}

interface CalculatorInputsProps {
  state: CalculatorState
  onInputChange: (field: keyof CalculatorState, value: any) => void
}

export default function CalculatorInputs({ state, onInputChange }: CalculatorInputsProps) {
  // funkcja pozwalająca na pustą wartość i tylko cyfry+kropka
  const handleInput = (field: keyof CalculatorState, raw: string, allowZero = true) => {
    if (raw === "") {
      onInputChange(field, "")
      return
    }
    if (!/^\d*\.?\d*$/.test(raw)) return
    onInputChange(field, raw)
  }

  const handleBlur = (
    field: keyof CalculatorState,
    min: number,
  ) => {
    const num = Number(state[field])
    if (state[field] === "" || isNaN(num)) {
      onInputChange(field, min)
      return
    }
    onInputChange(field, Math.max(min, num))
  }

  return (
    <div className="bg-white rounded-[14px] p-6 border border-[#ffe8d6] shadow-sm">
      <h2 className="text-[#3d2817] text-lg font-semibold mb-1">Dane wejściowe</h2>
      <p className="text-[#9b8b75] text-sm mb-6">Wypełnij pola i zobacz wyniki.</p>

      <div className="space-y-5">

        {/* Currency */}
        <div>
          <label className="block text-[#3d2817] text-sm font-medium mb-2">Waluta</label>
          <select
            value={state.currency}
            onChange={(e) => onInputChange("currency", e.target.value)}
            className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] border border-[#ffe8d6] text-sm"
          >
            <option value="PLN">PLN</option>
            <option value="USD">USD</option>
          </select>
        </div>

        {/* Rate */}
        <div>
          <label className="block text-[#3d2817] text-sm font-medium mb-2">Stawka eksperta (zł/h)</label>
          <input
            type="text"
            value={state.rate}
            onChange={(e) => handleInput("rate", e.target.value)}
            onBlur={() => handleBlur("rate", 20)}
            className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] border border-[#ffe8d6] text-sm"
          />
        </div>

        {/* HT */}
        <div>
          <label className="block text-[#3d2817] text-sm font-medium mb-2">Czas zadania (HT, h)</label>
          <input
            type="text"
            value={state.ht}
            onChange={(e) => handleInput("ht", e.target.value)}
            onBlur={() => handleBlur("ht", 0.5)}
            className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] border border-[#ffe8d6] text-sm"
          />
        </div>

        {/* MC */}
        <div>
          <label className="block text-[#3d2817] text-sm font-medium mb-2">Koszt modelu (MC)</label>
          <input
            type="text"
            value={state.mc}
            onChange={(e) => handleInput("mc", e.target.value)}
            onBlur={() => handleBlur("mc", 0)}
            className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] border border-[#ffe8d6] text-sm"
          />
        </div>

        {/* n */}
        <div>
          <label className="block text-[#3d2817] text-sm font-medium mb-3">
            Liczba prób (n): <span className="text-[#ff9566]">{state.n}</span>
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <button
                key={num}
                onClick={() => onInputChange("n", num)}
                className={`flex-1 py-2 rounded-[10px] font-medium text-sm transition-all ${
                  state.n === num ? "bg-[#ff9566] text-white" : "bg-[#fff5ed] border border-[#ffe8d6]"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Win rate */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">Win rate (w)</label>
            <span className="text-[#ff9566] font-semibold">{state.w}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            value={state.w}
            onChange={(e) => onInputChange("w", Number(e.target.value))}
            className="w-full h-2 bg-[#ffe8d6] rounded-full accent-[#ff9566]"
          />
        </div>

        {/* Tasks */}
        <div>
          <label className="block text-[#3d2817] text-sm font-medium mb-2">Zadań / mies.</label>
          <input
            type="text"
            value={state.tasks}
            onChange={(e) => handleInput("tasks", e.target.value)}
            onBlur={() => handleBlur("tasks", 1)}
            className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] border border-[#ffe8d6] text-sm"
          />
        </div>

        {/* Advanced toggle */}
        <button
          onClick={() => onInputChange("advancedOpen", !state.advancedOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#fffbf5] rounded-[10px] border border-[#ffe8d6] text-[#3d2817]"
        >
          Tryb zaawansowany
          <ChevronDown size={18} className={state.advancedOpen ? "rotate-180" : ""} />
        </button>

        {state.advancedOpen && (
          <div className="space-y-5 pt-4 border-t border-[#ffe8d6]">

            {/* RT */}
            <div>
              <label className="block mb-2 text-sm font-medium">Czas review (RT, h)</label>
              <input
                type="text"
                value={state.rt}
                onChange={(e) => handleInput("rt", e.target.value)}
                onBlur={() => handleBlur("rt", 0)}
                className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] border border-[#ffe8d6] text-sm"
              />
            </div>

            {/* RC */}
            <div>
              <label className="block mb-2 text-sm font-medium">Koszt review (RC)</label>
              <input
                type="text"
                value={state.rc}
                onChange={(e) => handleInput("rc", e.target.value)}
                onBlur={() => handleBlur("rc", 0)}
                className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] border border-[#ffe8d6] text-sm"
              />
            </div>

            {/* MT */}
            <div>
              <label className="block mb-2 text-sm font-medium">Czas modelu (MT, h)</label>
              <input
                type="text"
                value={state.mt}
                onChange={(e) => handleInput("mt", e.target.value)}
                onBlur={() => handleBlur("mt", 0)}
                className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] border border-[#ffe8d6] text-sm"
              />
            </div>

          </div>
        )}

      </div>
    </div>
  )
}
