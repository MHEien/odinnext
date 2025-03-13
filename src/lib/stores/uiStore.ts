import { create } from 'zustand';

interface UIState {
  isAccountMenuOpen: boolean;
  isCartOpen: boolean;
  openAccountMenu: () => void;
  closeAccountMenu: () => void;
  toggleAccountMenu: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAccountMenuOpen: false,
  isCartOpen: false,
  
  openAccountMenu: () => set({ isAccountMenuOpen: true }),
  closeAccountMenu: () => set({ isAccountMenuOpen: false }),
  toggleAccountMenu: () => set((state) => ({ isAccountMenuOpen: !state.isAccountMenuOpen })),
  
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),
  toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
})); 