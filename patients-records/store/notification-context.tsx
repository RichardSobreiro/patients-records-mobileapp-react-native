/** @format */
import ErrorDialog from '../components/ui/ErrorDialog';

import { createContext, useState } from 'react';

export type Notification = {
  title?: string | null | undefined;
  message?: string | null | undefined;
  status?: number | string | null | undefined;
};

export type NotificationState = {
  showNotification: (notification: Notification) => void;
  hideNotification: () => void;
};

const initialState: NotificationState = {
  showNotification: (notification: Notification) => {},
  hideNotification: () => {}
};

export const NotificationContext = createContext(initialState);

type Props = {
  children: string | JSX.Element | JSX.Element[];
};

const NotificationProvider = ({ children }: Props) => {
  const [show, setShow] = useState<boolean>(false);
  const [notification, setNotification] = useState<Notification>({});

  const showNotification = (state: Notification) => {
    setShow(true);
    setNotification(state);
  };

  const hideNotification = () => {
    setShow(false);
    setNotification({});
  };

  const value = {
    showNotification,
    hideNotification
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {show && (
        <ErrorDialog
          show={show}
          hideNotification={hideNotification}
          title={notification.title!}
          message={notification.message!}
        />
      )}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
