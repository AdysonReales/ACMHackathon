// ============================================================
// VIEW — BottomNav (Minimalist UI)
// ============================================================

import React from 'react'
import { BookOpen, Map, Library, User } from 'lucide-react'
import type { PageId } from '../models/types'

interface BottomNavProps {
  activePage: PageId
  setActivePage: (page: PageId) => void
}

export const BottomNav: React.FC<BottomNavProps> = ({ activePage, setActivePage }) => {
  const navItems = [
    { id: 'combat' as PageId, label: 'Learn', icon: BookOpen },
    { id: 'schedule' as PageId, label: 'Path', icon: Map },
    { id: 'evidence' as PageId, label: 'Library', icon: Library },
    { id: 'profile' as PageId, label: 'Profile', icon: User },
  ]

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-[var(--surface)] border-t border-[var(--border)] pb-safe pt-2 px-6 z-50">
      <div className="flex justify-between items-center max-w-lg mx-auto pb-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = activePage === item.id
          return (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={`flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 w-16 ${
                isActive ? 'text-[var(--primary)]' : 'text-[var(--muted)] hover:text-[var(--text)]'
              }`}
            >
              <Icon size={22} className={isActive ? 'stroke-[2.5]' : 'stroke-[2]'} />
              <span className={`text-[10px] mt-1 font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}