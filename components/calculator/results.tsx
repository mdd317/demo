"use client"

import type React from "react"

interface Calculations {
  HT: number
  HC: number
  be_cost: number
  be_time: number
  save_time_1: number
  save_cost_1: number
  monthly_save_1: number
  save_time_n: number
  save_cost_n: number
  monthly_save_n: number
  monthly_human: number
}

interface CalculatorState {
  currency: "PLN" | "USD"
  w: number
  n: number
}

interface CalculatorResultsProps {
  calculations: Calculations
  state: CalculatorState
}

function formatCurrency(value: number, currency: string): string {
  if (currency === "PLN") {
    return `${value.toFixed(2)} zł`
  }
  return `$${value.toFixed(2)}`
}

function Badge({ children, variant = "success" }: { children: React.ReactNode; variant?: "success" | "default" }) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
        variant === "success" ? "bg-[#ff9566] text-white" : "border border-[#ff9566] text-[#ff9566]"
      }`}
    >
      {children}
    </span>
  )
}

function ResultCard({
  title,
  rows,
  badge,
  hint,
}: {
  title: string
  rows: Array<{ label: string; value: string }>
  badge?: React.ReactNode
  hint?: string
}) {
  return (
    <div className="bg-white rounded-[14px] p-5 border border-[#ffe8d6] shadow-sm">
      <h3 className="text-[#3d2817] font-semibold mb-4">{title}</h3>
      <div className="space-y-3 mb-4">
        {rows.map((row, idx) => (
          <div key={idx} className="flex justify-between items-start">
            <span className="text-[#9b8b75] text-sm">{row.label}</span>
            <span className="text-[#3d2817] font-medium text-right text-sm">{row.value}</span>
          </div>
        ))}
      </div>
      {badge && <div className="mb-3">{badge}</div>}
      {hint && <p className="text-[#9b8b75] text-xs">{hint}</p>}
    </div>
  )
}

export default function CalculatorResults({ calculations, state }: CalculatorResultsProps) {
  const w_pct = state.w / 100

  return (
    <section>
      <h2 className="text-[#3d2817] text-lg font-semibold mb-4">Wyniki</h2>
      <div className="space-y-4">
        <ResultCard
          title="Wynik: Try 1×"
          rows={[
            {
              label: "Oszczędność / zadanie",
              value: `${formatCurrency(calculations.save_cost_1, state.currency)} | ${calculations.save_time_1.toFixed(2)} h`,
            },
            {
              label: "Oszczędność / miesiąc",
              value: formatCurrency(calculations.monthly_save_1, state.currency),
            },
          ]}
          badge={
            calculations.save_cost_1 > 0 ? (
              <Badge variant="success">ROI+</Badge>
            ) : (
              <Badge variant="default">Sprawdź progi</Badge>
            )
          }
          hint={`Próg kosztu: ${calculations.be_cost.toFixed(1)}% · Próg czasu: ${calculations.be_time.toFixed(1)}%`}
        />

        <ResultCard
          title={`Wynik: Try ${state.n}×`}
          rows={[
            {
              label: "Oszczędność / zadanie",
              value: `${formatCurrency(calculations.save_cost_n, state.currency)} | ${calculations.save_time_n.toFixed(2)} h`,
            },
            {
              label: "Oszczędność / miesiąc",
              value: formatCurrency(calculations.monthly_save_n, state.currency),
            },
          ]}
          hint="Więcej prób → większa szansa na dobry wynik."
        />

        <ResultCard
          title="Minimalny win rate (break-even)"
          rows={[
            {
              label: "Koszt opłaca się od",
              value: `${calculations.be_cost.toFixed(1)}%`,
            },
            {
              label: "Czas opłaca się od",
              value: `${calculations.be_time.toFixed(1)}%`,
            },
          ]}
          hint="Jeśli Twój w jest wyższy — zyskujesz."
        />
      </div>
    </section>
  )
}
