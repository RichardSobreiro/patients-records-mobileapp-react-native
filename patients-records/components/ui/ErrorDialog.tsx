import { Colors } from '../../constants/styles';

import { Button, Dialog, Portal, Text } from 'react-native-paper';

type Props = {
  show: boolean;
  hideNotification: () => void;
  title: string;
  message: string;
};

const ErrorDialog: React.FC<Props> = ({ hideNotification, show, title, message }) => {
  return (
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
            height: 350
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
            {title}
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
              {message}
            </Text>
          </Dialog.Content>
          <Dialog.Actions
            style={{
              flex: 1
            }}
          >
            <Button
              style={{ borderWidth: 1, borderColor: Colors.primary500, padding: 1 }}
              onPress={() => hideNotification()}
            >
              Continuar
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
};

export default ErrorDialog;
