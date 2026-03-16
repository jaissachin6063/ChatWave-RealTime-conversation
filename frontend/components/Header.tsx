export default function Header() {
  return (
    <header className="bg-white border-b shadow-sm px-4 py-3 flex items-center gap-3">
      <div className="text-2xl">🌊</div>
      <div>
        <h1 className="font-bold text-gray-800 text-lg leading-tight">ChatWave</h1>
        <p className="text-xs text-gray-400">Intelligent Real-Time Conversational Bot</p>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-xs text-gray-500"> Online</span>
      </div>
    </header>
  )
}
