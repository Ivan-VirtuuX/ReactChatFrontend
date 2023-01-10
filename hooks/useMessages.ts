import { useEffect, useState } from 'react';
import { Api } from '../utils/api';
import { Message } from '../utils/api/types';

export const useMessages = (conversationId?: string | string[], isSave?: boolean) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);

        if (conversationId) {
          const data = await Api().message.getAll();

          setMessages(data.filter((message) => message.conversationId === conversationId));

          setLocalMessages(data.filter((message) => message.conversationId === conversationId));
        } else if (!conversationId) {
          const data = await Api().message.getAll();

          setMessages(data);

          if (data) {
            setIsLoading(false);
          }
        }
      } catch (err) {
        console.warn(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [conversationId, isSave]);

  return { messages, setMessages, localMessages, setLocalMessages, isLoading };
};
