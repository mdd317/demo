"use client"
import { ChevronDown } from "lucide-react"

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

interface CalculatorInputsProps {
  state: CalculatorState
  onInputChange: (field: keyof CalculatorState, value: any) => void
}

export default function CalculatorInputs({ state, onInputChange }: CalculatorInputsProps) {
  return (
    <div className="bg-white rounded-[14px] p-6 border border-[#ffe8d6] shadow-sm">
      <h2 className="text-[#3d2817] text-lg font-semibold mb-1">Dane wejściowe</h2>
      <p className="text-[#9b8b75] text-sm mb-6">Wypełnij pola i zobacz wyniki w czasie rzeczywistym.</p>

      <div className="space-y-5">
        {/* Currency Select */}
        <div>
          <label htmlFor="currency" className="block text-[#3d2817] text-sm font-medium mb-2">
            Waluta
          </label>
          <select
            id="currency"
            value={state.currency}
            onChange={(e) => onInputChange("currency", e.target.value)}
            className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] text-[#3d2817] border border-[#ffe8d6] focus:outline-none focus:ring-2 focus:ring-[#ff9566] text-sm"
          >
            <option value="PLN">PLN</option>
            <option value="USD">USD</option>
          </select>
        </div>

        {/* Rate */}
        <div>
          <label htmlFor="rate" className="block text-[#3d2817] text-sm font-medium mb-2">
            Stawka eksperta (zł/h)
          </label>
          <input
            id="rate"
            type="number"
            min="20"
            step="10"
            value={state.rate}
            onChange={(e) => onInputChange("rate", Math.max(20, Number.parseFloat(e.target.value) || 20))}
            className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] text-[#3d2817] border border-[#ffe8d6] focus:outline-none focus:ring-2 focus:ring-[#ff9566] text-sm"
          />
        </div>

        {/* HT (Human Time) */}
        <div>
          <label htmlFor="ht" className="block text-[#3d2817] text-sm font-medium mb-2">
            Czas zadania (HT, h)
          </label>
          <input
            id="ht"
            type="number"
            min="0.5"
            step="0.1"
            value={state.ht}
            onChange={(e) => onInputChange("ht", Math.max(0.5, Number.parseFloat(e.target.value) || 0.5))}
            className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] text-[#3d2817] border border-[#ffe8d6] focus:outline-none focus:ring-2 focus:ring-[#ff9566] text-sm"
          />
        </div>

        {/* MC (Model Cost) */}
        <div>
          <label htmlFor="mc" className="block text-[#3d2817] text-sm font-medium mb-2">
            Koszt jednego przebiegu modelu (MC)
          </label>
          <input
            id="mc"
            type="number"
            min="0"
            step="1"
            value={state.mc}
            onChange={(e) => onInputChange("mc", Math.max(0, Number.parseFloat(e.target.value) || 0))}
            className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] text-[#3d2817] border border-[#ffe8d6] focus:outline-none focus:ring-2 focus:ring-[#ff9566] text-sm"
          />
        </div>

        {/* Stepper: Number of tries (n) */}
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
                  state.n === num
                    ? "bg-[#ff9566] text-white"
                    : "bg-[#fff5ed] text-[#3d2817] border border-[#ffe8d6] hover:border-[#ff9566]"
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Win rate slider */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label htmlFor="w" className="text-[#3d2817] text-sm font-medium">
              Win rate (w)
            </label>
            <span className="text-[#ff9566] text-sm font-semibold">{state.w}%</span>
          </div>
          <input
            id="w"
            type="range"
            min="0"
            max="100"
            step="1"
            value={state.w}
            onChange={(e) => onInputChange("w", Number.parseFloat(e.target.value))}
            className="w-full h-2 bg-[#ffe8d6] rounded-full appearance-none cursor-pointer accent-[#ff9566]"
          />
          {state.w === 0 && (
            <p className="text-[#9b8b75] text-xs mt-2">
              Przy 0% trafień AI zawsze poprawia człowiek — sprawdź break-even.
            </p>
          )}
        </div>

        {/* Tasks per month */}
        <div>
          <label htmlFor="tasks" className="block text-[#3d2817] text-sm font-medium mb-2">
            Zadań / mies.
          </label>
          <input
            id="tasks"
            type="number"
            min="1"
            step="1"
            value={state.tasks}
            onChange={(e) => onInputChange("tasks", Math.max(1, Number.parseFloat(e.target.value) || 1))}
            className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] text-[#3d2817] border border-[#ffe8d6] focus:outline-none focus:ring-2 focus:ring-[#ff9566] text-sm"
          />
        </div>

        {/* Advanced Mode Toggle */}
        <button
          onClick={() => onInputChange("advancedOpen", !state.advancedOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-[#fffbf5] rounded-[10px] border border-[#ffe8d6] hover:border-[#ff9566] transition-colors text-[#3d2817] font-medium"
        >
          Tryb zaawansowany
          <ChevronDown size={18} className={`transition-transform ${state.advancedOpen ? "rotate-180" : ""}`} />
        </button>

        {/* Advanced Mode Inputs */}
        {state.advancedOpen && (
          <div className="space-y-5 pt-4 border-t border-[#ffe8d6]">
            <div>
              <label htmlFor="rt" className="block text-[#3d2817] text-sm font-medium mb-2">
                Czas review (RT, h)
              </label>
              <input
                id="rt"
                type="number"
                min="0"
                step="0.1"
                value={state.rt}
                onChange={(e) => onInputChange("rt", Math.max(0, Number.parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] text-[#3d2817] border border-[#ffe8d6] focus:outline-none focus:ring-2 focus:ring-[#ff9566] text-sm"
              />
            </div>

            <div>
              <label htmlFor="rc" className="block text-[#3d2817] text-sm font-medium mb-2">
                Koszt review (RC)
              </label>
              <input
                id="rc"
                type="number"
                min="0"
                step="1"
                value={state.rc}
                onChange={(e) => onInputChange("rc", Math.max(0, Number.parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] text-[#3d2817] border border-[#ffe8d6] focus:outline-none focus:ring-2 focus:ring-[#ff9566] text-sm"
              />
            </div>

            <div>
              <label htmlFor="mt" className="block text-[#3d2817] text-sm font-medium mb-2">
                Czas przebiegu modelu (MT, h)
              </label>
              <input
                id="mt"
                type="number"
                min="0"
                step="0.05"
                value={state.mt}
                onChange={(e) => onInputChange("mt", Math.max(0, Number.parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] text-[#3d2817] border border-[#ffe8d6] focus:outline-none focus:ring-2 focus:ring-[#ff9566] text-sm"
              />
            </div>

            <div>
              <label className="block text-[#3d2817] text-sm font-medium mb-2">Koszt zadania – człowiek (HC)</label>
              <div className="px-3 py-2 rounded-[14px] bg-[#fffbf5] text-[#9b8b75] border border-[#ffe8d6] text-sm">
                {(state.rate * state.ht).toFixed(2)} {state.currency}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
