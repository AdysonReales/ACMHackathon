// ============================================================
// VIEW — App shell (layout + routing, zero business logic)
// ============================================================

import { useAppController } from './controllers/useAppController'
import { BottomNav } from './components/BottomNav'
import { CombatScreen } from './pages/CombatScreen'
import { ScheduleScreen } from './pages/ScheduleScreen'
import { EvidenceScreen } from './pages/EvidenceScreen'
import { ProfileScreen } from './pages/ProfileScreen'

function App() {
  const { activePage, setActivePage } = useAppController()

  const renderActivePage = () => {
    switch (activePage) {
      case 'combat':
        return <CombatScreen />
      case 'schedule':
        return <ScheduleScreen />
      case 'evidence':
        return <EvidenceScreen />
      case 'profile':
        return <ProfileScreen />
      default:
        return <CombatScreen />
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Banner Branding */}
      <header className="w-full bg-[var(--surface)] border-b border-[var(--border)] py-3 px-4 md:pl-32 sticky top-0 z-40 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚖️</span>
          <span className="font-bold text-sm tracking-wide uppercase text-[var(--text)] font-mono">
            Proseso: <span className="text-[var(--primary)]">Showdown</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[10px] font-mono font-bold text-[var(--muted)]">API LIVE</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full bg-[var(--bg)] flex flex-col md:pl-28">
        {renderActivePage()}
      </main>

      {/* Floating Bottom Nav */}
      <BottomNav activePage={activePage} setActivePage={setActivePage} />
    </div>
  )
}

export default App
