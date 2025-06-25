import { create } from 'zustand'

export interface BreadcrumbItem {
  label: string
  href?: string
  isCurrentPage?: boolean
}

interface BreadcrumbState {
  items: BreadcrumbItem[]
  setItems: (items: BreadcrumbItem[]) => void
  clear: () => void
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
  items: [],
  setItems: (items) => set({ items }),
  clear: () => set({ items: [] }),
}))