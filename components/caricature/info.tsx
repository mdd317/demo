"use client"

export default function CaricatureInfo() {
  return (
    <div className="space-y-4 pb-6">
      <div>
        <h3 className="text-[#3d2817] text-sm font-semibold mb-2">Jak to działa?</h3>
        <ul className="space-y-2">
          <li className="text-[#9b8b75] text-xs flex gap-2">
            <span className="text-[#ff9566] flex-shrink-0">•</span>
            <span>Twoje zdjęcie jest wysyłane do naszego serwera, gdzie model AI tworzy karykaturę.</span>
          </li>
          <li className="text-[#9b8b75] text-xs flex gap-2">
            <span className="text-[#ff9566] flex-shrink-0">•</span>
            <span>Model działa przez API (LLM generujący karykatury).</span>
          </li>
          <li className="text-[#9b8b75] text-xs flex gap-2">
            <span className="text-[#ff9566] flex-shrink-0">•</span>
            <span>Możesz pobrać karykaturę lub otrzymać ją e-mailem.</span>
          </li>
        </ul>
      </div>

      <div className="text-[#9b8b75]/70 text-xs border-t border-[#ffe8d6] pt-4">
        <p>Nie udostępniamy Twoich zdjęć osobom trzecim. Możesz poprosić o ich usunięcie w każdej chwili.</p>
      </div>
    </div>
  )
}
