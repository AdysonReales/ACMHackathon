// ============================================================
// VIEW — App shell (layout, zero business logic)
// ============================================================

import { CombatScreen } from './pages/CombatScreen'

import logo from './assets/logo.png'

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Banner Branding */}
      <header className="w-full bg-[var(--surface)] border-b border-[var(--border)] py-3 px-4 md:pl-32 sticky top-0 z-40 shadow-sm flex items-center justify-between">
        
        {/* Logo + Title */}
        <div className="flex items-center gap-2">
          <img
            src={logo}
            alt="Proseso Showdown Logo"
            className="w-6 h-6 object-contain"
          />

          <span className="font-bold text-sm tracking-wide uppercase text-[var(--text)] font-mono">
            Proseso<span className="text-[var(--primary)]">AI</span>
          </span>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono font-bold text-[var(--muted)]">
            API LIVE
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-[var(--bg)] flex flex-col md:pl-28">
        <CombatScreen />
      </main>
    </div>
  )
}

export default App