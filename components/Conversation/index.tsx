import Avatar from '@material-ui/core/Avatar';
import { useRouter } from 'next/router';
import React, { FC, useEffect, useRef, useState } from 'react';
import { useAppSelector } from '../../redux/hooks';
import { selectUserData } from '../../redux/slices/user';
import { Message, ResponseUser } from '../../utils/api/types';
import validator from 'validator';
import styles from './Conversation.module.scss';
import { Api } from '../../utils/api';
import { useMediaQuery } from '@material-ui/core';
import { ConversationSkeleton } from './ConversationSkeleton';

interface ConversationProps {
  conversationId?: string;
  sender?: ResponseUser;
  receiver?: ResponseUser;
  createdAt?: string;
  updatedAt?: string;
  msgText?: string;
  updatedMessages?: Message[];
  onUpdateConversation?: () => void;
}

export const Conversation: FC<ConversationProps> = ({
  conversationId,
  sender,
  receiver,
  msgText,
  updatedMessages,
  onUpdateConversation,
}) => {
  const [isCloseVisible, setIsCloseVisible] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [localMessages, setLocalMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const { id } = router.query;

  const matches1090 = useMediaQuery('(max-width:1090px)');
  const matches430 = useMediaQuery('(max-width:430px)');

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
      } finally {
        setIsLoading(false);
      }
    })();
  }, [onUpdateConversation]);

  useEffect(() => {
    (async () => {
      try {
        if (updatedMessages) {
          setMessages(
            updatedMessages.filter((message) => message.conversationId === conversationId),
          );
        } else {
          if (conversationId) {
            const data = await Api().message.getAll();

            setMessages(data.filter((message) => message.conversationId === conversationId));

            setLocalMessages(data.filter((message) => message.conversationId === conversationId));
          } else if (!conversationId) {
            const data = await Api().message.getAll();

            setMessages(data);
          }
        }
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [conversationId, updatedMessages]);

  useEffect(() => {
    crossRef?.current?.animate(opacityUp, timing);
  }, [isCloseVisible]);

  useEffect(() => {
    matches1090 ? setIsCloseVisible(true) : setIsCloseVisible(false);
  }, [matches1090]);

  useEffect(() => {
    if (matches1090) {
      setTimeout(() => {
        window.scrollTo({ left: 0, top: document.body.scrollHeight, behavior: 'smooth' });
      }, 250);
    }
  }, [id]);

  const userData = useAppSelector(selectUserData);

  const crossRef = useRef(null);

  const date = localMessages.length
    ? new Date(localMessages[localMessages.length - 1]?.createdAt)
    : '';

  const opacityUp = [
    {
      opacity: 0,
      transition: 'all 0.3s ease-in-out',
    },
    {
      opacity: 1,
      transition: 'all 0.3s ease-in-out',
    },
  ];

  const opacityDown = [
    {
      opacity: 1,
      transition: 'all 0.3s ease-in-out',
    },
    {
      opacity: 0,
      transition: 'all 0.3s ease-in-out',
    },
  ];

  const timing = {
    duration: 300,
    iterations: 1,
  };

  const onMouseLeave = () => {
    if (!matches1090) {
      crossRef?.current?.animate(opacityDown, timing);

      setTimeout(() => {
        setIsCloseVisible(false);
      }, 200);
    }
  };

  const onClickConversation = () => {
    if (id !== conversationId) {
      router.push(`/conversations/${conversationId}`);
    }
  };

  const onClickDelete = async () => {
    try {
      await Api().conversation.deleteConversation(conversationId);

      router.push('/conversations');
    } catch (err) {
      console.warn(err);
    } finally {
      router.push('/conversations');
    }
  };

  if (isLoading) {
    return (
      <div className={styles.conversationSkeleton}>
        <ConversationSkeleton />
      </div>
    );
  }

  return (
    <div
      className={`${styles.conversationContainer} ${
        conversationId === id ? styles.activeConversation : ''
      }`}
      onClick={onClickConversation}
      onMouseOver={() => setIsCloseVisible(true)}
      onMouseLeave={onMouseLeave}>
      <div>
        <div className={styles.leftSideContainer}>
          <Avatar src={receiver?.userId === userData?.id ? sender.avatarUrl : receiver.avatarUrl} />
          <div className={styles.leftSide}>
            <p>{receiver?.userId === userData?.id ? sender.fullName : receiver.fullName}</p>
            <p>
              {messages[messages.length - 1]?.text &&
              validator.isURL(messages[messages.length - 1]?.text) ? (
                <div className={styles.imageMessage}>
                  <p>
                    {messages[messages.length - 1]?.sender?.userId === userData?.id
                      ? 'Вы: Изображение'
                      : 'Изображение'}
                  </p>
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 18 18"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_237_658)">
                      <path
                        d="M2 18C1.45 18 0.979 17.8043 0.587 17.413C0.195667 17.021 0 16.55 0 16V2C0 1.45 0.195667 0.979 0.587 0.587C0.979 0.195667 1.45 0 2 0H16C16.55 0 17.021 0.195667 17.413 0.587C17.8043 0.979 18 1.45 18 2V16C18 16.55 17.8043 17.021 17.413 17.413C17.021 17.8043 16.55 18 16 18H2ZM3 14H15L11.25 9L8.25 13L6 10L3 14Z"
                        fill="#25182E"
                      />
                    </g>
                    <defs>
                      <clipPath id="clip0_237_658">
                        <rect width="18" height="18" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>
                </div>
              ) : msgText ? (
                msgText.length > 30 ? (
                  msgText.slice(0, 30) + '...'
                ) : (
                  msgText
                )
              ) : messages[messages.length - 1]?.text.length > 30 ? (
                messages[messages.length - 1]?.text.slice(0, 10) + '...'
              ) : messages[messages.length - 1]?.sender?.userId === userData?.id ? (
                'Вы: ' + messages[messages.length - 1]?.text
              ) : (
                messages[messages.length - 1]?.text
              )}
            </p>
          </div>
        </div>
        <p style={{ fontSize: 18 }}>
          {date
            ? matches430
              ? date.getDate() +
                '.' +
                date.toLocaleString('default', { month: '2-digit' }) +
                ' ' +
                date.getHours() +
                ':' +
                (String(date.getMinutes()).length === 2
                  ? date.getMinutes()
                  : '0' + date.getMinutes())
              : date.getDate() +
                ' ' +
                date.toLocaleString('default', { month: 'short' }) +
                ' ' +
                date.getHours() +
                ':' +
                (String(date.getMinutes()).length === 2
                  ? date.getMinutes()
                  : '0' + date.getMinutes())
            : ''}
        </p>
      </div>
      {isCloseVisible ? (
        <div className={styles.conversationBottom}>
          <hr className={styles.conversationLineClose} />
          <svg
            ref={crossRef}
            onClick={onClickDelete}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <line
              x1="1.69706"
              y1="-1.69706"
              x2="15.2735"
              y2="-1.69706"
              transform="matrix(0.707107 0.707107 0.707107 -0.707107 2.26318 0)"
              stroke="#929292"
              strokeWidth="3.39411"
              strokeLinecap="round"
            />
            <line
              x1="12"
              y1="2.4"
              x2="2.4"
              y2="12"
              stroke="#929292"
              strokeWidth="3.39411"
              strokeLinecap="round"
            />
          </svg>
        </div>
      ) : (
        <hr className={styles.conversationLine} />
      )}
    </div>
  );
};
