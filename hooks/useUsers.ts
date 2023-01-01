import { ResponseUser } from '../utils/api/types';
import { useEffect, useState } from 'react';
import { Api } from '../utils/api';

export const useUsers = (userId?: string | string[]) => {
  const [users, setUsers] = useState<ResponseUser[]>([]);
  const [user, setUser] = useState<ResponseUser>();

  useEffect(() => {
    (async () => {
      try {
        if (userId) {
          const data = await Api().user.getOne(userId);

          setUser(data);
        }
        const data = await Api().user.getAll();

        setUsers(data);
      } catch (err) {
        console.warn(err);
      }
    })();
  }, [userId]);

  return { users, setUsers, user, setUser };
};
