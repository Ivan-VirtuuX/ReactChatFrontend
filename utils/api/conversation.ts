import { AxiosInstance } from 'axios';
import { Conversation, ConversationDto } from './types';

export const ConversationApi = (instance: AxiosInstance) => ({
  async createConversation(dto: ConversationDto) {
    const { data } = await instance.post('/conversations', dto);

    return data;
  },

  async getAll() {
    const { data } = await instance.get<Conversation[]>('/conversations');

    return data;
  },

  async getOne(conversationId: string) {
    const { data } = await instance.get<Conversation>(`/conversations/${conversationId}`);

    return data;
  },

  async getMessages(conversationId: string) {
    const { data } = await instance.get<Conversation>(`/conversations/${conversationId}/messages`);

    return data;
  },

  async deleteConversation(conversationId: string) {
    const { data } = await instance.delete<Conversation>(`/conversations/${conversationId}`);

    return data;
  },
});
