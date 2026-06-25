// ============================================================
// VIEW — BottomNav (pure presentational, types from model)
// ============================================================

import React from 'react'
import { Swords, Map, Briefcase, User } from 'lucide-react'
import type { PageId } from '../models/types'

interface BottomNavProps {
  activePage: PageId
  setActivePage: (page: PageId) => void
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'combat' as PageId, label: 'Battle', icon: Swords },
    { id: 'schedule' as PageId, label: 'Map', icon: Map },
    { id: 'evidence' as PageId, label: 'Evidence', icon: Briefcase },
    { id: 'profile' as PageId, label: 'Profile', icon: User },
  ]

  return (
    <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-md bg-[var(--surface)] border border-[var(--border)] rounded-full p-2 shadow-custom z-50 transition-all duration-300 md:bottom-auto md:left-6 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:w-20 md:h-[400px] md:rounded-[32px] md:flex md:items-center md:justify-center">
      <div className="flex justify-between items-center px-2 w-full md:flex-col md:justify-around md:h-full md:px-0">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center justify-center py-2 px-4 rounded-full transition-all duration-300 md:w-14 md:h-14 md:px-0 ${
                isActive
                  ? 'bg-[var(--primary)] text-white shadow-md scale-105'
                  : 'text-[var(--muted)] hover:text-[var(--text)] hover:bg-slate-50'
              }`}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.5]' : 'stroke-[2]'} />
              <span className="text-[10px] font-semibold mt-0.5 tracking-wider uppercase md:hidden">
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
