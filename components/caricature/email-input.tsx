"use client"

import { useState } from "react"

interface EmailInputProps {
  onEmailChange: (email: string) => void
  initialEmail?: string
}

export default function CaricatureEmailInput({ onEmailChange, initialEmail = "" }: EmailInputProps) {
  const [email, setEmail] = useState(initialEmail)
  const [error, setError] = useState<string | null>(null)

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleEmailChange = (value: string) => {
    setEmail(value)
    setError(null)
    onEmailChange(value)
  }

  const handleBlur = () => {
    if (email && !validateEmail(email)) {
      setError("Nieprawidłowy adres e-mail")
    }
  }

  return (
    <div className="bg-white rounded-[14px] p-6 border border-[#ffe8d6] shadow-sm">
      <h2 className="text-[#3d2817] text-lg font-semibold mb-1">1. Adres e-mail</h2>
      <p className="text-[#9b8b75] text-sm mb-6">Na jaki adres e-mail mamy wysłać Twoją karykaturę?</p>

      <div>
        <label htmlFor="email" className="block text-[#3d2817] text-sm font-medium mb-2">
          Adres e-mail
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => handleEmailChange(e.target.value)}
          onBlur={handleBlur}
          placeholder="twoj.adres@email.com"
          className={`w-full px-3 py-2 rounded-[14px] bg-[#fffbf5] text-[#3d2817] border ${
            error ? "border-red-400" : "border-[#ffe8d6]"
          } focus:outline-none focus:ring-2 focus:ring-[#ff9566] text-sm placeholder-[#9b8b75]`}
        />
        {error && <p className="text-red-500 text-xs mt-2">{error}</p>}
      </div>
    </div>
  )
}
