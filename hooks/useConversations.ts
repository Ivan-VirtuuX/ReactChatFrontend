import { Conversation } from '../utils/api/types';
import { useEffect, useState } from 'react';
import { Api } from '../utils/api';

export const useConversations = (conversationId?: string) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [conversation, setConversation] = useState<Conversation>();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setIsLoading(true);
        if (conversationId) {
          const data = await Api().conversation.getOne(conversationId);

          setConversation(data);
        }
        const data = await Api().conversation.getAll();

        setConversations(data);

        setIsLoading(false);
      } catch (err) {
        console.warn(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [conversationId]);

  return { conversations, conversation, isLoading };
};
