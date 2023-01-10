import styles from './ConversationLayout.module.scss';
import { useRouter } from 'next/router';
import React, { FC, FormEvent, useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '../../../utils/context/SocketContext';
import { Api } from '../../../utils/api';
import { useAppSelector } from '../../../redux/hooks';
import { selectUserData } from '../../../redux/slices/user';
import { Message } from '../../Message';
import { useConversations } from '../../../hooks/useConversations';
import { Avatar, useMediaQuery } from '@material-ui/core';
import { CloudinaryApi } from '../../../utils/api/CloudinaryApi';
import { useMessages } from '../../../hooks/useMessages';
import { Message as MessageType } from '../../../utils/api/types';
import { v4 as uuidv4 } from 'uuid';
import { ConversationLayoutSkeleton } from './ConversationLayoutSkeleton';

interface ConversationLayoutProps {
  conversationId?: string;
  handleUpdate?: (messages: MessageType[]) => void;
  onUpdateConversation?: () => void;
}

const ConversationLayout: FC<ConversationLayoutProps> = ({
  conversationId,
  handleUpdate,
  onUpdateConversation,
}) => {
  const [message, setMessage] = useState('');
  const [imageFormData, setImageFormData] = useState([]);
  const [attachedImageFormData, setAttachedImageFormData] = useState([]);
  const [image, setImage] = useState<File>();
  const [attachedImage, setAttachedImage] = useState<File>();
  const [isSave, setIsSave] = useState(false);
  const [isSaveImage, setIsSaveImage] = useState(false);
  const [preview, setPreview] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const inputFileRef = useRef(null);
  const attachedImageRef = useRef(null);

  const userData = useAppSelector(selectUserData);

  const socket = useContext(SocketContext);

  const router = useRouter();

  const { id } = router.query;

  const { conversation, isLoading, setConversation } = useConversations(conversationId);

  const matches480 = useMediaQuery('(max-width:480px)');
  const matches505 = useMediaQuery('(max-width:505px)');

  const { localMessages, setLocalMessages } = useMessages(id, isSave);

  const handleDeleteMessage = async (messageId: string) => {
    setLocalMessages(localMessages.filter((message) => message.messageId !== messageId));
  };

  const handleSubmitNewMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onUpdateConversation();

    handleUpdate(localMessages);

    try {
      setIsUploading(true);

      if (isSaveImage) {
        const { secure_url } = await onSubmitAttachedImage();

        if (secure_url) {
          await Api().message.sendMessage({
            messageId: uuidv4(),
            conversationId: String(id),
            sender: { ...userData },
            text: secure_url,
          });

          setAttachedImageFormData([]);
          setPreview('');
        }
      }

      if (message) {
        await Api().message.sendMessage({
          messageId: uuidv4(),
          conversationId: String(id),
          sender: { ...userData },
          text: message,
        });

        setMessage('');
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleChangeAvatar = async (files) => {
    try {
      const formData: any = new FormData();

      formData.append('file', files[0]);
      formData.append('upload_preset', 'cqxjdiz4');

      setImageFormData(formData);

      setImage(files[0]);

      files[0] && setIsSave(true);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при загрузке файла');
    }
  };

  const onChangeAvatar = () => {
    inputFileRef.current.click();
  };

  const onSubmitImage = async () => {
    try {
      const { data } = await CloudinaryApi().cloudinary.changeImage(imageFormData);

      await Api().user.updateAvatar(id, data.secure_url);
    } catch (err) {
      console.warn(err);
      alert('Update image error');
    } finally {
      setIsSave(false);
    }
  };

  const onCloseImage = () => {
    setAttachedImageFormData([]);
    setPreview('');
  };

  const onSubmitAttachedImage = async () => {
    try {
      setIsUploading(true);

      const { data } = await CloudinaryApi().cloudinary.changeImage(attachedImageFormData);

      setIsUploading(false);

      return data;
    } catch (err) {
      console.warn(err);
      alert('Update image error');
    } finally {
      setIsSaveImage(false);
      setIsUploading(false);
    }
  };

  const onChangeImage = () => {
    attachedImageRef.current.click();
  };

  const handleChangeImage = async (files) => {
    try {
      const formData: any = new FormData();

      formData.append('file', files[0]);
      formData.append('upload_preset', 'cqxjdiz4');

      setAttachedImageFormData(formData);

      setAttachedImage(files[0]);

      files && setIsSaveImage(true);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при загрузке файла');
    }
  };

  useEffect(() => {
    if (!userData) {
      router.push('/');
    }
  }, []);

  useEffect(() => {
    (async () => {
      try {
        socket.on('onMessage', async (payload) => {
          const { ...message } = payload;

          const data = await Api().conversation.getOne(message.conversationId);

          if (data.receiver.userId === userData.id || data.sender.userId === userData.id) {
            setLocalMessages((localMessages) => [...localMessages, message]);
          }
        });

        socket.on('onDeleteMessage', (messageId) => {
          setLocalMessages((localMessages) => [
            ...localMessages.filter((message) => message.messageId !== messageId),
          ]);
        });
      } catch (err) {
        console.warn(err);
      }
    })();

    return () => {
      socket.off('onMessage');
      socket.off('onDeleteMessage');
      socket.off('message');
    };
  }, [socket, conversation?.receiver?.userId, id]);

  useEffect(() => {
    if (attachedImage) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result as string);
      };

      reader.readAsDataURL(attachedImage);
    } else {
      setPreview(null);
    }
  }, [image, attachedImage]);

  console.log(conversation);

  if (isLoading) {
    return <ConversationLayoutSkeleton />;
  }

  conversation?.sender?.userId === userData?.id
    ? delete conversation['sender']
    : delete conversation['receiver'];

  return (
    <>
      <div className={styles.conversationHeader}>
        <div className={styles.headerLeftSide}>
          {conversation?.receiver?.avatarUrl || conversation?.sender?.avatarUrl ? (
            <img
              src={
                conversation?.receiver
                  ? conversation?.receiver?.avatarUrl
                  : conversation?.sender?.avatarUrl
              }
              alt="avatar"
              className={styles.avatar}
            />
          ) : (
            <Avatar style={{ marginRight: 10 }} />
          )}
          <p>
            {matches480
              ? conversation?.receiver?.fullName.length > 8
                ? conversation?.receiver?.fullName.slice(0, 5) + '...'
                : conversation?.receiver?.fullName
              : conversation?.receiver?.fullName || conversation?.sender?.fullName}
          </p>
        </div>
        {matches505 ? (
          <div>
            <input
              accept="image/*"
              ref={inputFileRef}
              type="file"
              onChange={(e) => handleChangeAvatar(e.target.files)}
              hidden
            />
            <div className={styles.changeAvatarButtonsMini}>
              {!isSave && (
                <div className={styles.changeAvatarButtonContainer}>
                  <svg
                    onClick={onChangeAvatar}
                    width="22"
                    height="22"
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M26.749 24.93C28.1851 23.2021 29.184 21.1537 29.661 18.9582C30.1381 16.7626 30.0793 14.4845 29.4897 12.3164C28.9001 10.1484 27.797 8.15423 26.2737 6.50268C24.7504 4.85112 22.8517 3.59075 20.7383 2.82818C18.6248 2.06561 16.3589 1.82328 14.132 2.12168C11.9051 2.42008 9.78282 3.25043 7.94472 4.5425C6.10662 5.83457 4.60675 7.55034 3.57199 9.54467C2.53724 11.539 1.99804 13.7532 2.00001 16C2.00076 19.2662 3.15175 22.4278 5.25101 24.93L5.23101 24.947C5.30101 25.031 5.38101 25.103 5.45301 25.186C5.54301 25.289 5.64001 25.386 5.73301 25.486C6.01301 25.79 6.30101 26.082 6.60301 26.356C6.69501 26.44 6.79001 26.518 6.88301 26.598C7.20301 26.874 7.53201 27.136 7.87301 27.38C7.91701 27.41 7.95701 27.449 8.00101 27.48V27.468C10.3431 29.1162 13.1371 30.0007 16.001 30.0007C18.8649 30.0007 21.6589 29.1162 24.001 27.468V27.48C24.045 27.449 24.084 27.41 24.129 27.38C24.469 27.135 24.799 26.874 25.119 26.598C25.212 26.518 25.307 26.439 25.399 26.356C25.701 26.081 25.989 25.79 26.269 25.486C26.362 25.386 26.458 25.289 26.549 25.186C26.62 25.103 26.701 25.031 26.771 24.946L26.749 24.93ZM16 8C16.89 8 17.7601 8.26392 18.5001 8.75838C19.2401 9.25285 19.8169 9.95566 20.1575 10.7779C20.4981 11.6002 20.5872 12.505 20.4135 13.3779C20.2399 14.2508 19.8113 15.0526 19.182 15.682C18.5526 16.3113 17.7508 16.7399 16.8779 16.9135C16.005 17.0872 15.1002 16.998 14.2779 16.6575C13.4557 16.3169 12.7529 15.7401 12.2584 15.0001C11.7639 14.26 11.5 13.39 11.5 12.5C11.5 11.3065 11.9741 10.1619 12.818 9.31802C13.6619 8.4741 14.8065 8 16 8V8ZM8.00701 24.93C8.02435 23.617 8.55795 22.3636 9.49236 21.4409C10.4268 20.5183 11.6869 20.0007 13 20H19C20.3132 20.0007 21.5732 20.5183 22.5076 21.4409C23.4421 22.3636 23.9757 23.617 23.993 24.93C21.7998 26.9063 18.9523 28.0001 16 28.0001C13.0477 28.0001 10.2002 26.9063 8.00701 24.93V24.93Z"
                      fill="#25182E"
                    />
                  </svg>
                </div>
              )}
              {isSave && (
                <button className={styles.save} onClick={onSubmitImage}>
                  Сохранить
                </button>
              )}
            </div>
          </div>
        ) : (
          <div>
            <input
              accept="image/*"
              ref={inputFileRef}
              type="file"
              onChange={(e) => handleChangeAvatar(e.target.files)}
              hidden
            />
            <div className={styles.changeAvatarButtons}>
              <div className={styles.changeAvatarButtonContainer}>
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M26.749 24.93C28.1851 23.2021 29.184 21.1537 29.661 18.9582C30.1381 16.7626 30.0793 14.4845 29.4897 12.3164C28.9001 10.1484 27.797 8.15423 26.2737 6.50268C24.7504 4.85112 22.8517 3.59075 20.7383 2.82818C18.6248 2.06561 16.3589 1.82328 14.132 2.12168C11.9051 2.42008 9.78282 3.25043 7.94472 4.5425C6.10662 5.83457 4.60675 7.55034 3.57199 9.54467C2.53724 11.539 1.99804 13.7532 2.00001 16C2.00076 19.2662 3.15175 22.4278 5.25101 24.93L5.23101 24.947C5.30101 25.031 5.38101 25.103 5.45301 25.186C5.54301 25.289 5.64001 25.386 5.73301 25.486C6.01301 25.79 6.30101 26.082 6.60301 26.356C6.69501 26.44 6.79001 26.518 6.88301 26.598C7.20301 26.874 7.53201 27.136 7.87301 27.38C7.91701 27.41 7.95701 27.449 8.00101 27.48V27.468C10.3431 29.1162 13.1371 30.0007 16.001 30.0007C18.8649 30.0007 21.6589 29.1162 24.001 27.468V27.48C24.045 27.449 24.084 27.41 24.129 27.38C24.469 27.135 24.799 26.874 25.119 26.598C25.212 26.518 25.307 26.439 25.399 26.356C25.701 26.081 25.989 25.79 26.269 25.486C26.362 25.386 26.458 25.289 26.549 25.186C26.62 25.103 26.701 25.031 26.771 24.946L26.749 24.93ZM16 8C16.89 8 17.7601 8.26392 18.5001 8.75838C19.2401 9.25285 19.8169 9.95566 20.1575 10.7779C20.4981 11.6002 20.5872 12.505 20.4135 13.3779C20.2399 14.2508 19.8113 15.0526 19.182 15.682C18.5526 16.3113 17.7508 16.7399 16.8779 16.9135C16.005 17.0872 15.1002 16.998 14.2779 16.6575C13.4557 16.3169 12.7529 15.7401 12.2584 15.0001C11.7639 14.26 11.5 13.39 11.5 12.5C11.5 11.3065 11.9741 10.1619 12.818 9.31802C13.6619 8.4741 14.8065 8 16 8V8ZM8.00701 24.93C8.02435 23.617 8.55795 22.3636 9.49236 21.4409C10.4268 20.5183 11.6869 20.0007 13 20H19C20.3132 20.0007 21.5732 20.5183 22.5076 21.4409C23.4421 22.3636 23.9757 23.617 23.993 24.93C21.7998 26.9063 18.9523 28.0001 16 28.0001C13.0477 28.0001 10.2002 26.9063 8.00701 24.93V24.93Z"
                    fill="#25182E"
                  />
                </svg>
                <button onClick={onChangeAvatar} className={styles.changeAvatar}>
                  Изменить аватар
                </button>
              </div>
              {isSave && (
                <button className={styles.save} onClick={onSubmitImage}>
                  Сохранить
                </button>
              )}
            </div>
          </div>
        )}
        <svg
          className={styles.close}
          onClick={() => router.push('/conversations')}
          width="18"
          height="18"
          viewBox="0 0 18 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <line
            x1="2.12132"
            y1="-2.12132"
            x2="19.0919"
            y2="-2.12132"
            transform="matrix(0.707107 0.707107 0.707107 -0.707107 2.8291 0)"
            stroke="#929292"
            strokeWidth="4.24264"
            strokeLinecap="round"
          />
          <line
            x1="15"
            y1="3"
            x2="3"
            y2="15"
            stroke="#929292"
            strokeWidth="4.24264"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className={styles.conversationBody}>
        {localMessages
          ?.map((obj, index) => {
            return (
              <Message
                key={index}
                {...obj}
                handleDeleteMessage={handleDeleteMessage}
                userId={userData?.id}
                onUpdateConversation={onUpdateConversation}
                handleUpdate={handleUpdate}
              />
            );
          })
          .reverse()}
      </div>
      <div className={styles.conversationFooter}>
        {preview && (
          <div style={{ height: 100 }}>
            <img className={styles.imagePreview} src={preview} alt="image preview" />
            <div className={styles.imageContainer}>
              <svg
                onClick={onCloseImage}
                className={styles.closeImage}
                width="28"
                height="28"
                viewBox="0 0 28 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <rect width="28" height="28" fill="black" fill-opacity="0.5" />
                <line
                  x1="1.42777"
                  y1="-1.42777"
                  x2="12.8499"
                  y2="-1.42777"
                  transform="matrix(0.707107 0.707107 0.707107 -0.707107 9.9043 9)"
                  stroke="white"
                  strokeWidth="2.85554"
                  strokeLinecap="round"
                />
                <line
                  x1="18.0957"
                  y1="11.0192"
                  x2="10.019"
                  y2="19.0959"
                  stroke="white"
                  strokeWidth="2.85554"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        )}
        <form onSubmit={handleSubmitNewMessage}>
          <div className={styles.attachImageButton}>
            <svg
              onClick={onChangeImage}
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <g clipPath="url(#clip0_48_1134)">
                <path
                  d="M19.1737 14.4783C18.5254 14.4783 17.9998 15.0039 17.9998 15.6522V18.0001H15.652C15.0036 18.0001 14.4781 18.5256 14.4781 19.174C14.4781 19.8223 15.0036 20.3479 15.652 20.3479H17.9998V22.6957C17.9998 23.344 18.5254 23.8696 19.1737 23.8696C19.8221 23.8696 20.3476 23.344 20.3476 22.6957V20.3479H22.6955C23.3438 20.3479 23.8694 19.8223 23.8694 19.174C23.8694 18.5256 23.3438 18.0001 22.6955 18.0001H20.3476V15.6522C20.3476 15.0039 19.8221 14.4783 19.1737 14.4783ZM12.4824 21.5218H2.73894C1.44763 21.5218 0.391113 20.4653 0.391113 19.174V2.73918C0.391113 1.44788 1.44763 0.391357 2.73894 0.391357H19.1737C20.465 0.391357 21.5215 1.44788 21.5215 2.73918V12.4827C20.8172 12.2479 19.9955 12.1305 19.1737 12.1305C17.8824 12.1305 16.5911 12.4827 15.5346 13.187L14.7087 12.0661C14.2984 11.5093 13.4696 11.4985 13.045 12.0445L10.5781 15.2162C10.1692 15.7419 9.37913 15.7552 8.95276 15.2436L7.67729 13.713C7.25092 13.2014 6.46088 13.2147 6.05199 13.7404L4.0488 16.3159C3.5157 17.0014 4.00415 18.0001 4.87248 18.0001H12.2476C12.1302 18.3522 12.1302 18.8218 12.1302 19.174C12.1302 19.9957 12.2476 20.8174 12.4824 21.5218Z"
                  fill="#929292"
                />
              </g>
              <defs>
                <clipPath id="clip0_48_1134">
                  <rect width="24" height="24" fill="white" />
                </clipPath>
              </defs>
            </svg>
            <input
              accept="image/*"
              ref={attachedImageRef}
              type="file"
              onChange={(e) => handleChangeImage(e.target.files)}
              hidden
            />
          </div>
          <input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            type="text"
            placeholder="Сообщение..."
            disabled={isUploading}
          />
          <button disabled={isUploading}>
            <svg
              width="38"
              height="38"
              viewBox="0 0 38 38"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M4.09516 2.5008C3.89637 2.40137 3.67367 2.35974 3.45239 2.38062C3.23111 2.4015 3.02013 2.48407 2.84345 2.61893C2.66678 2.75379 2.53149 2.93552 2.45299 3.14346C2.37449 3.35141 2.35593 3.5772 2.39941 3.79517L5.73153 15.3139C5.79367 15.5286 5.91511 15.7214 6.0819 15.8701C6.24869 16.0188 6.45406 16.1174 6.67441 16.1547L20.1882 18.418C20.8247 18.5439 20.8247 19.4559 20.1882 19.5818L6.67441 21.8452C6.45406 21.8824 6.24869 21.981 6.0819 22.1298C5.91511 22.2785 5.79367 22.4713 5.73153 22.6859L2.39941 34.2047C2.35593 34.4226 2.37449 34.6484 2.45299 34.8564C2.53149 35.0643 2.66678 35.2461 2.84345 35.3809C3.02013 35.5158 3.23111 35.5983 3.45239 35.6192C3.67367 35.6401 3.89637 35.5985 4.09516 35.4991L34.9702 20.0615C35.1671 19.9628 35.3328 19.8112 35.4485 19.6237C35.5643 19.4363 35.6256 19.2203 35.6256 18.9999C35.6256 18.7796 35.5643 18.5636 35.4485 18.3761C35.3328 18.1886 35.1671 18.037 34.9702 17.9383L4.09516 2.5008Z"
                fill="#929292"
              />
            </svg>
          </button>
        </form>
      </div>
    </>
  );
};

export default ConversationLayout;
