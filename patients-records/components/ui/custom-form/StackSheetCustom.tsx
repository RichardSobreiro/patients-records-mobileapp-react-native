/* eslint-disable import/order */
import StackSheetHeader from './StackSheetHeader';
import {
  Modal,
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  useWindowDimensions,
  SafeAreaView
} from 'react-native';
import { useTheme } from 'react-native-paper';

type Props = {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  positiveActionLabel: string;
  children: any;
  hideModalCallback?: () => void;
  saveModalCallback?: () => void;
};

const supportedOrientations: any = [
  'portrait',
  'portrait-upside-down',
  'landscape',
  'landscape-left',
  'landscape-right'
];

const StackSheetCustom: React.FC<Props> = ({
  visible,
  setVisible,
  positiveActionLabel,
  children,
  hideModalCallback,
  saveModalCallback
}: Props) => {
  const hideModal = () => {
    hideModalCallback?.();
    setVisible(false);
  };
  const theme = useTheme();
  const dimensions = useWindowDimensions();

  return (
    <>
      {/* <Portal> */}
      <View style={[StyleSheet.absoluteFill]} pointerEvents="box-none">
        <Modal
          animationType={'slide'}
          transparent={true}
          visible={visible}
          onRequestClose={hideModal}
          presentationStyle="overFullScreen"
          supportedOrientations={supportedOrientations}
          statusBarTranslucent={true}
        >
          <>
            <TouchableWithoutFeedback onPress={hideModal}>
              <View
                style={[
                  StyleSheet.absoluteFill,
                  styles.modalBackground,
                  { backgroundColor: theme.colors.backdrop }
                ]}
              />
            </TouchableWithoutFeedback>
            <SafeAreaView
              style={[StyleSheet.absoluteFill, styles.modalRoot]}
              pointerEvents="box-none"
            >
              <View
                style={[
                  styles.modalContent,
                  { backgroundColor: theme.colors.surface },
                  dimensions.width > 650 ? styles.modalContentBig : null
                ]}
              >
                <StackSheetHeader
                  onDismiss={hideModal}
                  onSave={() => {
                    saveModalCallback?.();
                  }}
                  locale="pt"
                  positiveActionLabel={positiveActionLabel}
                />
                {children}
              </View>
            </SafeAreaView>
          </>
        </Modal>
        {/* </Portal> */}
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  displayTextView: {
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center'
  },
  modalRoot: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flex: 1,
    width: '100%'
  },
  modalBackground: {
    flex: 1
  },
  modalContent: {
    flex: 1,
    width: '100%',
    paddingHorizontal: 20
  },
  modalContentBig: {
    borderRadius: 10,
    width: '100%',
    overflow: 'hidden'
  }
});

export default StackSheetCustom;
