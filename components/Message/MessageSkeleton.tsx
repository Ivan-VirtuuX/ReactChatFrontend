import React from 'react';
import styles from './Message.module.scss';
import { Skeleton } from '@material-ui/lab';

export const MessageSkeleton = () => {
  return (
    <div className={styles.skeleton}>
      <Skeleton variant="circle" width={40} height={40} style={{ borderRadius: 50 }} />
      <div className={styles.skeletonLeftSide}>
        <Skeleton variant="text" width={100} height={20} />
        <Skeleton variant="text" width={150} height={20} />
      </div>
    </div>
  );
};
