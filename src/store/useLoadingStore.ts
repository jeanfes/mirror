import { create } from "zustand";

interface LoadingState {
  isPageLoading: boolean;
  setIsPageLoading: (isLoading: boolean) => void;
}

export const useLoadingStore = create<LoadingState>((set) => ({
  isPageLoading: false,
  setIsPageLoading: (isLoading) => set({ isPageLoading: isLoading }),
}));
