import { useCallback, useState } from 'react';

const useAsyncErrorHandler = () => {
  const [, setError] = useState();
  return useCallback(
    (e) => {
      setError(() => {
        throw e;
      });
    },
    [setError]
  );
};

export default useAsyncErrorHandler;
