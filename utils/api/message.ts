import { AxiosInstance } from 'axios';
import { Message } from './types';

export const MessageApi = (instance: AxiosInstance) => ({
  async sendMessage(message: Message) {
    const { data } = await instance.post('/messages', message);

    return data;
  },

  async getAll() {
    const { data } = await instance.get<Message[]>('/messages');

    return data;
  },

  async deleteMessage(messageId: string) {
    const { data } = await instance.delete<Message>(`/messages/${messageId}`);

    return data;
  },
});
