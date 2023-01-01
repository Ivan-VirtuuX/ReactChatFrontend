import { useEffect, useState } from 'react';
import { Api } from '../utils/api';
import { Message } from '../utils/api/types';

export const useMessages = (conversationId?: string | string[], isSave?: boolean) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);

  useEffect(() => {
    (async () => {
      try {
        if (conversationId) {
          const data = await Api().message.getAll();

          setMessages(data.filter((message) => message.conversationId === conversationId));

          setLocalMessages(data.filter((message) => message.conversationId === conversationId));
        } else if (!conversationId) {
          const data = await Api().message.getAll();

          setMessages(data);
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [conversationId, isSave]);

  return { messages, setMessages, localMessages, setLocalMessages };
};
