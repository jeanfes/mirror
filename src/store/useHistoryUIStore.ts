import { create } from "zustand"

interface HistoryUIState {
  selectedProfileId: string
  appliedFilter: "all" | "applied" | "pending"
  search: string
  setSelectedProfileId: (value: string) => void
  setAppliedFilter: (value: "all" | "applied" | "pending") => void
  setSearch: (value: string) => void
  resetFilters: () => void
}

const initialState = {
  selectedProfileId: "all",
  appliedFilter: "all" as const,
  search: ""
}

export const useHistoryUIStore = create<HistoryUIState>((set) => ({
  ...initialState,
  setSelectedProfileId: (value) => set({ selectedProfileId: value }),
  setAppliedFilter: (value) => set({ appliedFilter: value }),
  setSearch: (value) => set({ search: value }),
  resetFilters: () => set(initialState)
}))
