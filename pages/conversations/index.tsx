import { useMediaQuery } from '@material-ui/core';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect } from 'react';
import ConversationsLayout from '../../components/Layouts/ConversationsLayout';
import { useAppSelector } from '../../redux/hooks';
import { selectUserData } from '../../redux/slices/user';
import styles from './Conversations.module.scss';

const Conversations: NextPage = () => {
  const router = useRouter();

  const userData = useAppSelector(selectUserData);

  const matches1090 = useMediaQuery('(max-width:1090px)');

  useEffect(() => {
    if (!userData) {
      router.push('/');
    }
  }, []);

  return (
    <div className={styles.messagesContainer}>
      <div className={styles.leftSide}>
        <ConversationsLayout />
      </div>
      <div className={styles.rightSide}>
        {!matches1090 && router.asPath === '/conversations' && (
          <div className={styles.rightSideText}>
            <p>Ни один диалог не выбран</p>
            <p>
              Откройте один из диалогов, <br /> чтобы увидеть сообщения
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;
