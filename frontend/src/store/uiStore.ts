import { create } from 'zustand';

interface UIState {
    isLoginPromptOpen: boolean;
    openLoginPrompt: () => void;
    closeLoginPrompt: () => void;
}

export const useUIStore = create<UIState>((set) => ({
    isLoginPromptOpen: false,
    openLoginPrompt: () => set({ isLoginPromptOpen: true }),
    closeLoginPrompt: () => set({ isLoginPromptOpen: false }),
}));
