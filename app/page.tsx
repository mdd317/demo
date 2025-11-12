"use client"

import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-[480px] flex flex-col gap-4">
        <button
          onClick={() => handleNavigate("/kalkulator")}
          className="w-full px-5 py-4 rounded-[14px] bg-[#ff9566] text-white border border-[#ffe8d6] shadow-sm hover:bg-[#ff7f4d] focus:outline-none focus:ring-2 focus:ring-[#ff9566] focus:ring-offset-2 transition-all min-h-[44px] text-center font-medium text-lg"
        >
          Kalkulator
        </button>

        <button
          onClick={() => handleNavigate("/karykatury")}
          className="w-full px-5 py-4 rounded-[14px] bg-[#ff9566] text-white border border-[#ffe8d6] shadow-sm hover:bg-[#ff7f4d] focus:outline-none focus:ring-2 focus:ring-[#ff9566] focus:ring-offset-2 transition-all min-h-[44px] text-center font-medium text-lg"
        >
          Karykatury
        </button>
      </div>
    </main>
  )
}
