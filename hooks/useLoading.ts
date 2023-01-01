import { useState, useEffect } from 'react';

export const useLoading = (timeout?: number) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(
      () => {
        setIsLoading(false);
      },
      timeout ? timeout : 2000,
    );
  }, []);

  return { isLoading, setIsLoading };
};
