import { Avatar } from '@material-ui/core';
import React, { FC, useEffect, useRef, useState } from 'react';
import { ResponseUser } from '../../utils/api/types';
import styles from './Message.module.scss';
import validator from 'validator';
import { Api } from '../../utils/api';
import { Message as MessageType } from '../../utils/api/types';

interface MessageProps {
  messageId?: string;
  id?: string;
  conversationId?: string;
  sender?: ResponseUser;
  text?: string;
  createdAt?: string | Date;
  handleDeleteMessage?: (messageId: string) => void;
  onUpdateConversation?: () => void;
  handleUpdate?: (messages: MessageType[]) => void;
  userId?: string;
}

export const Message: FC<MessageProps> = ({
  sender,
  text,
  messageId,
  userId,
  handleDeleteMessage,
  onUpdateConversation,
  handleUpdate,
  createdAt,
}) => {
  const [isActionsVisible, setIsActionsVisible] = useState(false);

  const deleteMessageRef = useRef(null);
  const deleteImageRef = useRef(null);
  const messageRef = useRef(null);
  const messageContainerRef = useRef(null);

  const date = new Date(createdAt);

  const moveUp = [
    {
      transform: 'translateY(50px)',
      transition: 'all 0.05s ease-in-out',
    },
    {
      transform: 'translateY(0px)',
      transition: 'all 0.05s ease-in-out',
    },
  ];

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

  const timing = {
    duration: 100,
    iterations: 1,
  };

  useEffect(() => {
    deleteMessageRef?.current?.animate(opacityUp, timing);
    deleteImageRef?.current?.animate(opacityUp, timing);
  }, [isActionsVisible]);

  useEffect(() => {
    messageContainerRef?.current?.animate(moveUp, timing);
  }, []);

  const onClickDelete = async () => {
    setIsActionsVisible(false);

    try {
      await Api().message.deleteMessage(messageId);

      const messages = await Api().message.getAll();

      handleUpdate(messages);

      onUpdateConversation();

      handleDeleteMessage(messageId);
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    setIsActionsVisible(false);
  }, [messageId]);

  return (
    <div className={styles.conversationContainer} ref={messageContainerRef}>
      <div>
        <div className={styles.leftSideContainer}>
          <Avatar src={sender.avatarUrl} />
          <div className={styles.leftSide}>
            <div>
              <div className={styles.messageHeader}>
                <p>{sender?.fullName}</p>
                <p className={styles.createdAt}>
                  {date?.getDate() === new Date().getDate() &&
                  date?.getDay() === new Date().getDay()
                    ? 'Сегодня в ' +
                      date?.getHours() +
                      ':' +
                      (String(date.getMinutes()).length === 2
                        ? date.getMinutes()
                        : '0' + date.getMinutes())
                    : date?.getDay() + 1 === Number(new Date().getDay())
                    ? 'Вчера в ' +
                      date?.getHours() +
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
                        : '0' + date.getMinutes())}
                </p>
              </div>

              {validator.isURL(text) ? (
                <p
                  style={{
                    paddingLeft: 10,
                    paddingBottom: 10,
                    paddingTop: 10,
                    marginTop: 10,
                    pointerEvents:
                      (sender.userId || sender?.id) !== userId && userId ? 'none' : 'all',
                  }}
                  className={styles.imageMessageActions}
                  onMouseOver={() => {
                    (sender.userId || sender?.id) === userId && setIsActionsVisible(true);
                  }}
                  onMouseLeave={() => {
                    (sender.userId || sender?.id) === userId && setIsActionsVisible(false);
                  }}>
                  <img className={styles.image} src={text} alt="image" />
                  {isActionsVisible && (
                    <svg
                      onClick={onClickDelete}
                      ref={deleteImageRef}
                      width="10"
                      height="12"
                      viewBox="0 0 10 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M1.6 10.2001C1.6 10.8601 2.14 11.4001 2.8 11.4001H7.6C8.26 11.4001 8.8 10.8601 8.8 10.2001V4.2001C8.8 3.5401 8.26 3.0001 7.6 3.0001H2.8C2.14 3.0001 1.6 3.5401 1.6 4.2001V10.2001ZM8.8 1.2001H7.3L6.874 0.774098C6.766 0.666098 6.61 0.600098 6.454 0.600098H3.946C3.79 0.600098 3.634 0.666098 3.526 0.774098L3.1 1.2001H1.6C1.27 1.2001 1 1.4701 1 1.8001C1 2.1301 1.27 2.4001 1.6 2.4001H8.8C9.13 2.4001 9.4 2.1301 9.4 1.8001C9.4 1.4701 9.13 1.2001 8.8 1.2001Z"
                        fill="#929292"
                      />
                    </svg>
                  )}
                </p>
              ) : (
                <p
                  style={{
                    pointerEvents:
                      (sender.userId || sender?.id) !== userId && userId ? 'none' : 'all',
                  }}
                  onMouseOver={() => {
                    (sender.userId || sender?.id) === userId && setIsActionsVisible(true);
                  }}
                  onMouseLeave={() => {
                    (sender.userId || sender?.id) === userId && setIsActionsVisible(false);
                  }}
                  className={styles.messageActions}
                  ref={messageRef}>
                  <p className={styles.text}>{text}</p>
                  {isActionsVisible && (
                    <p>
                      <svg
                        onClick={onClickDelete}
                        ref={deleteMessageRef}
                        width="10"
                        height="12"
                        viewBox="0 0 10 12"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M1.6 10.2001C1.6 10.8601 2.14 11.4001 2.8 11.4001H7.6C8.26 11.4001 8.8 10.8601 8.8 10.2001V4.2001C8.8 3.5401 8.26 3.0001 7.6 3.0001H2.8C2.14 3.0001 1.6 3.5401 1.6 4.2001V10.2001ZM8.8 1.2001H7.3L6.874 0.774098C6.766 0.666098 6.61 0.600098 6.454 0.600098H3.946C3.79 0.600098 3.634 0.666098 3.526 0.774098L3.1 1.2001H1.6C1.27 1.2001 1 1.4701 1 1.8001C1 2.1301 1.27 2.4001 1.6 2.4001H8.8C9.13 2.4001 9.4 2.1301 9.4 1.8001C9.4 1.4701 9.13 1.2001 8.8 1.2001Z"
                          fill="#929292"
                        />
                      </svg>
                    </p>
                  )}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
