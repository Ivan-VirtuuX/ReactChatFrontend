import React from 'react';
import styles from './Conversation.module.scss';
import { Skeleton } from '@material-ui/lab';

export const ConversationSkeleton = () => {
  return (
    <div className={styles.skeleton}>
      <div className={styles.skeletonLeftSide}>
        <Skeleton
          variant="circle"
          width={40}
          height={40}
          style={{ borderRadius: 50, marginRight: 10 }}
        />
        <div className={styles.skeletonUser}>
          <Skeleton variant="text" width={100} height={20} className={styles.skeletonUsername} />
          <Skeleton variant="text" width={150} height={20} className={styles.skeletonMessageText} />
        </div>
      </div>
      <Skeleton variant="text" width={100} height={20} />
    </div>
  );
};
