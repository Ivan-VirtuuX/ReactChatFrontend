import { List, Paper, ListItem, useMediaQuery } from '@material-ui/core';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { destroyCookie } from 'nookies';
import React, { useEffect, useRef, useState } from 'react';
import { useOutsideClick } from '../../hooks/useOutsideClick';
import { useUsers } from '../../hooks/useUsers';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectUserData, setUserData } from '../../redux/slices/user';
import { Api } from '../../utils/api';
import styles from './Header.module.scss';

export const Header = () => {
  const [isResultVisible, setIsResultVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [conversationId, setConversationId] = useState('');

  const matches430 = useMediaQuery('(max-width:430px)');

  const userData = useAppSelector(selectUserData);

  const dispatch = useAppDispatch();

  const router = useRouter();

  const handleClickOutside = () => {
    !isResultVisible && overlayRef?.current?.animate(opacityDown, timing);

    setIsResultVisible(false);
  };

  const ref = useOutsideClick(handleClickOutside);

  const overlayRef = useRef(null);

  const { users } = useUsers();

  const opacityUp = [
    {
      opacity: 0,
      transition: 'all 0.15s ease-in-out',
    },
    {
      opacity: 1,
      transition: 'all 0.15s ease-in-out',
    },
  ];

  const opacityDown = [
    {
      opacity: 1,
      transition: 'all 0.15s ease-in-out',
    },
    {
      opacity: 0,
      transition: 'all 0.15s ease-in-out',
    },
  ];

  const timing = {
    duration: 200,
    iterations: 1,
  };

  const onLogout = () => {
    destroyCookie(null, 'authToken', { path: '/' });
    router.push('/');
    dispatch(setUserData(null));
  };

  const addConversation = async (receiverId: string, id: string) => {
    try {
      const data = await Api().conversation.createConversation({ receiver: receiverId });
      setConversationId(data.conversationId);

      router.push(`/conversations/${data.conversationId}`);
    } catch (err) {
      console.warn(err);
      router.push(`/conversations/${id}`);
    }
  };

  const onClickResult = async (userId: string) => {
    try {
      const conversations = await Api().conversation.getAll();

      const id = conversations?.find(
        (conversation) =>
          conversation.receiver.userId === userId || conversation.sender.userId === userId,
      )?.conversationId;

      setIsResultVisible(false);
      addConversation(userId, id);
      setSearchValue('');
    } catch (err) {
      console.warn(err);
    }
  };

  const onClickSearch = () => {
    setIsResultVisible(true);

    !isResultVisible && overlayRef?.current?.animate(opacityUp, timing);
  };

  const onClickOverlay = () => {
    overlayRef?.current?.animate(opacityDown, timing);

    setTimeout(() => {
      setIsResultVisible(false);
    }, 150);
  };

  useEffect(() => {
    overlayRef?.current?.animate(opacityUp, timing);
  }, [isResultVisible]);

  return (
    <>
      <div className={styles.header}>
        <div className={styles.headerContainer}>
          <div>
            <svg
              width="24"
              height="29"
              viewBox="0 0 24 29"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.94929 27.2921C1.58215 27.9249 2.4787 28.2414 3.63895 28.2414C4.85193 28.2414 5.76166 27.9249 6.36816 27.2921C6.97465 26.6329 7.27789 25.7231 7.27789 24.5629V17.4828H9.45335C10.0862 17.4828 10.64 17.6014 11.1146 17.8387C11.6156 18.0497 12.0243 18.4452 12.3408 19.0254L15.9402 25.6308C16.4412 26.5274 17.0081 27.1866 17.641 27.6085C18.3002 28.0304 19.144 28.2414 20.1724 28.2414C21.2008 28.2414 21.9787 28.0172 22.5061 27.569C23.0598 27.0943 23.3499 26.501 23.3763 25.789C23.4026 25.0507 23.2049 24.2992 22.783 23.5345L20.8053 19.9746C20.2252 18.8671 19.5 18.0497 18.6298 17.5223C18.2189 17.2608 17.7785 17.061 17.3087 16.923C17.8361 16.7747 18.3292 16.5921 18.788 16.3753C20.2647 15.6633 21.3854 14.6613 22.1501 13.3692C22.9412 12.0507 23.3367 10.5081 23.3367 8.74138C23.3367 5.99899 22.4665 3.86308 20.7262 2.33367C19.0122 0.777891 16.573 0 13.4087 0H3.6785C2.51826 0 1.60852 0.31643 0.94929 0.94929C0.31643 1.58215 0 2.49189 0 3.6785V24.5629C0 25.7231 0.31643 26.6329 0.94929 27.2921ZM11.5635 2.78997C12.8382 2.91448 14.0296 3.48049 14.9323 4.39042L14.9598 4.40144C15.8684 5.30547 16.4335 6.49865 16.5578 7.77526C16.6822 9.05188 16.3578 10.3319 15.6408 11.3947C14.9238 12.4575 13.8589 13.2365 12.6299 13.5973C11.4009 13.9581 10.0846 13.8782 8.90813 13.3713C8.79706 13.3244 8.6757 13.3073 8.55603 13.3217L6.20138 13.7955H6.09135C6.01711 13.7974 5.94325 13.7843 5.87423 13.7568C5.8052 13.7293 5.74245 13.6882 5.68974 13.6358C5.62545 13.5711 5.57821 13.4914 5.55229 13.4038C5.52636 13.3163 5.52255 13.2237 5.5412 13.1344L6.02533 10.8038C6.04588 10.6839 6.02857 10.5606 5.97582 10.4511C5.46967 9.27288 5.38985 7.95468 5.75013 6.7238C6.11041 5.49292 6.8882 4.4265 7.94943 3.70839C9.01065 2.99027 10.2888 2.66547 11.5635 2.78997Z"
                fill="#25182E"
              />
            </svg>
            <div className={styles.input}>
              <i>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M9.84189 5.04811C9.84189 7.38469 7.92042 9.28855 5.53816 9.28855C3.1559 9.28855 1.23443 7.38469 1.23443 5.04811C1.23443 2.71153 3.1559 0.807676 5.53816 0.807676C7.92042 0.807676 9.84189 2.71153 9.84189 5.04811Z"
                    stroke="#AAAAAA"
                    strokeWidth="0.843868"
                  />
                  <line
                    x1="0.492256"
                    y1="-0.492256"
                    x2="3.9334"
                    y2="-0.492256"
                    transform="matrix(0.711858 0.702324 -0.711858 0.702324 7.90088 8.15649)"
                    stroke="#AAAAAA"
                    strokeWidth="0.984512"
                    strokeLinecap="round"
                  />
                </svg>
              </i>
              <input
                type="text"
                className={styles.search}
                placeholder={`${matches430 ? 'Поиск' : 'Поиск собеседника'}`}
                onClick={onClickSearch}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
              {isResultVisible &&
                searchValue &&
                users.filter((user) =>
                  user.fullName[0].toLowerCase().includes(searchValue[0].toLowerCase()),
                ).length > 0 && (
                  <Paper className={styles.searchBlockPopup} ref={ref}>
                    <List>
                      {users
                        .filter((user) =>
                          user.fullName[0].toLowerCase().includes(searchValue[0].toLowerCase()),
                        )
                        .map((user) => (
                          <Link key={user.userId} href={`/conversations/${conversationId}`}>
                            <ListItem button onClick={() => onClickResult(user.userId)}>
                              {user.fullName}
                            </ListItem>
                            <hr />
                          </Link>
                        ))}
                    </List>
                  </Paper>
                )}
            </div>
          </div>
          <div className={styles.user}>
            <p>{userData?.fullName}</p>
            <svg
              onClick={onLogout}
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path
                d="M16.2917 15.333L20.125 11.4997M20.125 11.4997L16.2917 7.66634M20.125 11.4997H6.70833M12.4583 15.333V16.2913C12.4583 17.0538 12.1554 17.7851 11.6163 18.3243C11.0771 18.8634 10.3458 19.1663 9.58333 19.1663H5.75C4.9875 19.1663 4.25624 18.8634 3.71707 18.3243C3.1779 17.7851 2.875 17.0538 2.875 16.2913V6.70801C2.875 5.94551 3.1779 5.21424 3.71707 4.67508C4.25624 4.13591 4.9875 3.83301 5.75 3.83301H9.58333C10.3458 3.83301 11.0771 4.13591 11.6163 4.67508C12.1554 5.21424 12.4583 5.94551 12.4583 6.70801V7.66634"
                stroke="#25182E"
                strokeWidth="1.91667"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>
      {isResultVisible && (
        <div ref={overlayRef} className={styles.bgOverlay} onClick={onClickOverlay} />
      )}
    </>
  );
};
