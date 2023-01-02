import { useMediaQuery } from '@material-ui/core';
import { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { NextPage } from 'next/types';
import { useEffect } from 'react';
import ConversationsLayout from '../../components/Layouts/ConversationsLayout';
import { useAppSelector } from '../../redux/hooks';
import { selectUserData, setUserData } from '../../redux/slices/user';
import { wrapper } from '../../redux/store';
import styles from './Conversations.module.scss';
import { Api } from '../../utils/api';

const Conversations = ({ Component, pageProps }: AppProps) => {
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

Conversations.getInitialProps = wrapper.getInitialAppProps(
  (store) =>
    async ({ ctx, Component }) => {
      try {
        const userData = await Api(ctx).user.getMe();

        store.dispatch(setUserData(userData));
      } catch (err) {
        console.warn(err);
      }

      return {
        pageProps: Component.getInitialProps
          ? await Component.getInitialProps({ ...ctx, store })
          : {},
      };
    },
);

export default Conversations;
