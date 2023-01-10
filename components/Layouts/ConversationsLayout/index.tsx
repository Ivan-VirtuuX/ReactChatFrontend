import Head from 'next/head';
import { FC, useState } from 'react';
import { useConversations } from '../../../hooks/useConversations';
import { useMessages } from '../../../hooks/useMessages';
import { Conversation } from '../../Conversation';
import { ConversationSkeleton } from '../../Conversation/ConversationSkeleton';
import styles from './ConversationsLayout.module.scss';

interface ConversationLayoutProps {
  onUpdateConversation?: () => void;
}

const ConversationsLayout: FC<ConversationLayoutProps> = ({ onUpdateConversation }) => {
  const [keyword, setKeyword] = useState('');

  const { messages, isLoading } = useMessages();

  const { conversations } = useConversations();

  return (
    <>
      <Head>
        <title className={styles.dialogs}>Диалоги</title>
      </Head>
      <p className={styles.title}>Диалоги</p>
      <div className={styles.input}>
        <i>
          <svg
            width="17"
            height="18"
            viewBox="0 0 17 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M14.2372 7.79868C14.2372 11.4244 11.2556 14.3787 7.559 14.3787C3.86238 14.3787 0.880799 11.4244 0.880799 7.79868C0.880799 4.17295 3.86238 1.21869 7.559 1.21869C11.2556 1.21869 14.2372 4.17295 14.2372 7.79868Z"
              stroke="#AAAAAA"
              strokeWidth="1.30945"
            />
            <line
              x1="0.763846"
              y1="-0.763846"
              x2="6.10356"
              y2="-0.763846"
              transform="matrix(0.711858 0.702324 -0.711858 0.702324 11.2253 12.6218)"
              stroke="#AAAAAA"
              strokeWidth="1.52769"
              strokeLinecap="round"
            />
          </svg>
        </i>
        <input
          type="text"
          className={styles.search}
          placeholder="Поиск"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <div className={styles.conversations}>
        {!keyword
          ? isLoading
            ? [...Array(5)].map((_, index) => <ConversationSkeleton key={index} />)
            : conversations.map((obj) => (
                <Conversation
                  key={obj.conversationId}
                  {...obj}
                  onUpdateConversation={onUpdateConversation}
                />
              ))
          : conversations.map((obj) => {
              const msgText = messages.filter(
                (message) =>
                  message.text.toLowerCase().includes(keyword.toLowerCase()) &&
                  message.conversationId === obj.conversationId,
              )[0]?.text;

              return (
                msgText && <Conversation key={obj.conversationId} {...obj} msgText={msgText} />
              );
            })}
      </div>
    </>
  );
};

export default ConversationsLayout;
