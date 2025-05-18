import { create } from "zustand";

interface SidebarState {
  isOpen: boolean;
  toggle: () => void;
}

const useSidebarStore = create<SidebarState>((set) => ({
  isOpen: true, // État initial de la sidebar
  toggle: () => set((state) => ({ isOpen: !state.isOpen })), // Fonction pour basculer l'état
}));

export default useSidebarStore;
