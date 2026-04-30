import { create } from 'zustand';

interface UIState {
    isLoginPromptOpen: boolean;
    openLoginPrompt: () => void;
    closeLoginPrompt: () => void;
    activeReportId: number | null;
    setActiveReportId: (id: number | null) => void;
    isCommentsOpen: boolean;
    setIsCommentsOpen: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
    isLoginPromptOpen: false,
    openLoginPrompt: () => set({ isLoginPromptOpen: true }),
    closeLoginPrompt: () => set({ isLoginPromptOpen: false }),
    activeReportId: null,
    setActiveReportId: (id) => set({ activeReportId: id }),
    isCommentsOpen: false,
    setIsCommentsOpen: (isOpen) => set({ isCommentsOpen: isOpen }),
}));
