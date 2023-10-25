/** @format */
import { Colors } from '../constants/styles';

import { createContext, useState } from 'react';
import { Button, Dialog, Portal, Text } from 'react-native-paper';

export type Notification = {
  title?: string | null | undefined;
  message?: string | null | undefined;
  status?: string | null | undefined;
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
        <>
          <Portal>
            <Dialog
              style={{
                backgroundColor: Colors.primary100,
                borderColor: Colors.primary800,
                borderWidth: 1,
                justifyContent: 'center',
                alignContent: 'center',
                alignSelf: 'center',
                maxWidth: 250,
                maxHeight: 270
              }}
              visible={show}
              onDismiss={hideNotification}
            >
              <Dialog.Title
                style={{
                  flex: 2,
                  justifyContent: 'center',
                  alignContent: 'center',
                  alignItems: 'center'
                }}
              >
                {notification.title}
              </Dialog.Title>
              <Dialog.Content
                style={{
                  flex: 2,
                  alignItems: 'flex-start',
                  flexWrap: 'wrap'
                }}
              >
                <Text
                  variant="bodyMedium"
                  style={{
                    alignItems: 'flex-start',
                    flexWrap: 'wrap'
                  }}
                >
                  {notification.message}
                </Text>
              </Dialog.Content>
              <Dialog.Actions
                style={{
                  flex: 1
                }}
              >
                <Button onPress={() => hideNotification()}>Ok</Button>
              </Dialog.Actions>
            </Dialog>
          </Portal>
        </>
      )}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
