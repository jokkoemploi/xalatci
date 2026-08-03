import apiClient from './axios';
import { ChatMessage } from '../types';

export const messageService = {
  getMessages: async () => {
    const res = await apiClient.get<ChatMessage[]>('/chat/messages');
    return res.data;
  },

  sendMessage: async (text: string) => {
    const res = await apiClient.post<ChatMessage>('/chat/messages', { text });
    return res.data;
  }
};

export default messageService;
