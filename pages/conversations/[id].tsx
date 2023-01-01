import React, { useState } from 'react';
import ConversationsLayout from '../../components/Layouts/ConversationsLayout';
import styles from './Conversations.module.scss';
import { NextPage } from 'next';
import ConversationLayout from '../../components/Layouts/ConversationLayout';
import { useRouter } from 'next/dist/client/router';
import { Message } from '../../utils/api/types';

const ConversationPage: NextPage = () => {
  const [updatedMessages, setUpdatedMessages] = useState<Message[]>([]);

  const router = useRouter();

  const handleUpdate = (messages: Message[]) => {
    setUpdatedMessages(messages);
  };

  const onUpdateConversation = () => {
    console.log('conversation updated');
  };

  return (
    <div className={styles.messagesContainer}>
      <div className={styles.leftSide}>
        <ConversationsLayout onUpdateConversation={onUpdateConversation} />
      </div>
      <div className={styles.conversationContainer}>
        <ConversationLayout
          conversationId={String(router.query.id)}
          handleUpdate={handleUpdate}
          onUpdateConversation={onUpdateConversation}
        />
      </div>
    </div>
  );
};

export default ConversationPage;
