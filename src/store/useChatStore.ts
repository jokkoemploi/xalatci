import { create } from 'zustand';

interface ChatState {
  activeConversationId: string | null;
  unreadCount: number;
  setActiveConversationId: (id: string | null) => void;
  setUnreadCount: (count: number) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversationId: 'support-1',
  unreadCount: 0,
  setActiveConversationId: (id) => set({ activeConversationId: id }),
  setUnreadCount: (count) => set({ unreadCount: count }),
}));
