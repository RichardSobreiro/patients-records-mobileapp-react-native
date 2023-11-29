import useAsyncErrorHandler from '../hooks/useAsyncErrorHandler';
import { getUserNotifications } from '../http/NotificationsApi';
import GetNotificationsResponse from '../models/notifications/GetNotificationsResponse';
import { AuthContext } from './auth-context';

import { createContext, useContext, useState } from 'react';

interface UserNotificationState {
  unReadNotificationsCount: number;
  updateUserNotificationsState: () => void;
}

const initialState: UserNotificationState = {
  unReadNotificationsCount: 0,
  updateUserNotificationsState: () => {}
};

export const UserNotificationsContext = createContext(initialState);

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const UserNotificationProvider = ({ children }: Props) => {
  const [unReadNotificationsCount, setUnReadNotificationsCount] = useState<number>(0);

  const authCtx = useContext(AuthContext);
  const asyncErrorHandler = useAsyncErrorHandler();

  const updateUserNotificationsState = async () => {
    if (authCtx.token?.access_token) {
      try {
        const response = await getUserNotifications(authCtx.token.access_token, '1', '10');

        if (response.ok) {
          const body = response.body as GetNotificationsResponse;
          setUnReadNotificationsCount(body.unReadNotificationsCount);
        } else {
          asyncErrorHandler(
            new Error(
              `UserNotificationContext.updateUserNotificationsState - else: ${JSON.stringify(
                response
              )}`,
              {
                cause: response.httpStatusCode
              }
            )
          );
        }
      } catch (error: any) {
        asyncErrorHandler(
          new Error(
            `UserNotificationContext.updateUserNotificationsState - catch: ${JSON.stringify(
              error
            )}`,
            {
              cause: error.message
            }
          )
        );
      }
    }
  };

  const value = {
    unReadNotificationsCount,
    updateUserNotificationsState
  };

  return (
    <UserNotificationsContext.Provider value={value}>{children}</UserNotificationsContext.Provider>
  );
};

export default UserNotificationProvider;
