// ============================================================
// CONTROLLER — App-level routing state
// ============================================================

import { useState } from 'react'
import type { PageId, AppController } from '../models/types'

export const useAppController = (): AppController => {
  const [activePage, setActivePage] = useState<PageId>('combat')

  return {
    activePage,
    setActivePage,
  }
}
