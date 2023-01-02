import React from 'react';
import styles from './ConversationLayout.module.scss';
import { Skeleton } from '@material-ui/lab';
import { MessageSkeleton } from '../../Message/MessageSkeleton';
import { useMediaQuery } from '@material-ui/core';

export const ConversationLayoutSkeleton = () => {
  const matches1090 = useMediaQuery('(max-width:1090px)');
  const matches520 = useMediaQuery('(max-width:520px)');
  const matches505 = useMediaQuery('(max-width:505px)');

  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonHeader}>
        <div className={styles.skeletonHeaderLeftSide}>
          <div>
            <Skeleton
              variant="circle"
              width={47}
              height={47}
              style={{ borderRadius: 50, marginRight: 10 }}
            />
          </div>
          <Skeleton variant="text" width={100} height={20} className={styles.skeletonUsername} />
        </div>
        <div className={styles.skeletonHeaderChangeAvatar}>
          <Skeleton
            variant="circle"
            width={22}
            height={22}
            style={{ borderRadius: 50, marginRight: 10 }}
          />
          {!matches505 && <Skeleton variant="text" width={matches520 ? 100 : 150} height={20} />}
        </div>
        <div>
          <Skeleton variant="rect" width={20} height={20} style={{ borderRadius: 5 }} />
        </div>
      </div>
      <div className={styles.skeletonBody}>
        {[...Array(matches1090 ? 6 : 7)].map((_, index) => (
          <MessageSkeleton key={index} />
        ))}
      </div>
      <div className={styles.skeletonFooter}>
        <div>
          <Skeleton
            variant="rect"
            width={24}
            height={24}
            style={{ borderRadius: 5, marginRight: 30 }}
          />
        </div>
        <Skeleton variant="rect" width={'100%'} height={62} style={{ borderRadius: 13 }} />
        <div>
          <Skeleton
            variant="rect"
            width={38}
            height={38}
            style={{ borderRadius: 5, marginLeft: 30 }}
          />
        </div>{' '}
      </div>
    </div>
  );
};
