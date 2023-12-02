import PaymentInstalmentsStatus from '../constants/enums/PaymentInstalmentsStatus';
import useAsyncErrorHandler from '../hooks/useAsyncErrorHandler';
import { getUserNotifications } from '../http/NotificationsApi';
import { getAccountSettings } from '../http/SettingsApi';
import GetNotificationsResponse from '../models/notifications/GetNotificationsResponse';
import GetAccountSettingsResponse from '../models/settings/accounts/GetAccountSettingsResponse';
import { AuthContext } from './auth-context';

import { createContext, useContext, useState } from 'react';

interface AccountSettingsState {
  unReadNotificationsCount: number;
  updateUserNotificationsState: () => void;
  accountSettings: GetAccountSettingsResponse | undefined;
  updateAccountSettingsState: () => void;
}

const initialState: AccountSettingsState = {
  unReadNotificationsCount: 0,
  updateUserNotificationsState: () => {},
  accountSettings: undefined,
  updateAccountSettingsState: () => {}
};

export const AccountSettingsContext = createContext(initialState);

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const AccountSettingsProvider = ({ children }: Props) => {
  const [unReadNotificationsCount, setUnReadNotificationsCount] = useState<number>(0);
  const [accountSettingsFromServer, setAccountSettingsFromServer] = useState<
    GetAccountSettingsResponse | undefined
  >(undefined);

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

  const updateAccountSettingsState = async () => {
    try {
      console.log(`${new Date().toLocaleTimeString()} - UPDATED PAYMENT STATUS`);
      const response = await getAccountSettings(authCtx.token?.access_token!);
      if (response.ok) {
        const getAccountSettingsResponse = response.body as GetAccountSettingsResponse;
        if (
          (getAccountSettingsResponse.paymentStatus as PaymentInstalmentsStatus) !==
          accountSettingsFromServer?.paymentStatus
        ) {
          setAccountSettingsFromServer(getAccountSettingsResponse);
          authCtx.setPaymentStatus(getAccountSettingsResponse.paymentStatus);
          console.log(
            `${new Date().toLocaleTimeString()} - UPDATED PAYMENT STATUS RESPONSE: ${
              getAccountSettingsResponse.paymentStatus
            }`
          );
        }
      } else {
        asyncErrorHandler(
          new Error(
            `UserSettingsContext.updateAccountSettingsState - else: ${JSON.stringify(response)}`,
            {
              cause: response.httpStatusCode
            }
          )
        );
      }
    } catch (error: any) {
      asyncErrorHandler(
        new Error(
          `UserSettingsContext.updateAccountSettingsState - catch: ${JSON.stringify(error)}`,
          {
            cause: error.message
          }
        )
      );
    }
  };

  const value = {
    unReadNotificationsCount,
    updateUserNotificationsState,
    accountSettings: accountSettingsFromServer,
    updateAccountSettingsState
  };

  return (
    <AccountSettingsContext.Provider value={value}>{children}</AccountSettingsContext.Provider>
  );
};

export default AccountSettingsProvider;
