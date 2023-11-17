import Plans from '../../../constants/enums/Plans';
import { Colors } from '../../../constants/styles';
import useAsyncErrorHandler from '../../../hooks/useAsyncErrorHandler';
import { getAccountSettings, updateAccountSettings } from '../../../http/SettingsApi';
import GetAccountSettingsResponse from '../../../models/settings/accounts/GetAccountSettingsResponse';
import UpdateAccountSettingsRequest from '../../../models/settings/accounts/UpdateAccountSettingsRequest';
import { AuthContext } from '../../../store/auth-context';
import Button, { ButtonTypes } from '../../ui/Button';

import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Snackbar } from 'react-native-paper';

type Props = {
  navigation: any;
};

const PaymentMethodSettings: React.FC<Props> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const asyncErrorHandler = useAsyncErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accountSettingsFromServer, setAccountSettingsFromServer] = useState<
    GetAccountSettingsResponse | undefined
  >(undefined);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [yPosition, setYPosition] = useState<number>(0);
  const isFocused = useIsFocused();

  const [plan, setPlan] = useState<Plans>(Plans.Anual);

  const submitHandler = async () => {
    if (plan === null || plan === undefined || plan.trim() === '') {
      return;
    }

    setIsLoading(true);

    const request = { ...accountSettingsFromServer } as unknown as UpdateAccountSettingsRequest;
    request.userPlanId = plan;

    try {
      const response = await updateAccountSettings(authCtx.token?.access_token!, request);
      if (response.ok) {
        if (!authCtx.userInfo?.userCreationCompleted) {
          navigation.navigate('PaymentMethod');
        } else {
          setVisibleSnackbar(true);
          setTimeout(() => {
            setVisibleSnackbar(false);
          }, 5000);
        }
      } else {
        asyncErrorHandler(
          new Error(`PaymentMethodSettings.submitHandler - else: ${JSON.stringify(response)}`, {
            cause: response.httpStatusCode
          })
        );
      }
    } catch (error: any) {
      asyncErrorHandler(
        new Error(`PaymentMethodSettings.submitHandler - catch: ${JSON.stringify(error)}`, {
          cause: error.message
        })
      );
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const getAccountSettingsAsync = async () => {
      setIsLoading(true);

      try {
        const response = await getAccountSettings(authCtx.token?.access_token!);
        if (response.ok) {
          const getAccountSettingsResponse = response.body as GetAccountSettingsResponse;
          setAccountSettingsFromServer(getAccountSettingsResponse);
          setPlan((getAccountSettingsResponse.userPlanId as Plans) ?? Plans.Anual);
        } else {
          asyncErrorHandler(
            new Error(
              `PaymentMethodSettings.getAccountSettingsAsync - else: ${JSON.stringify(response)}`,
              {
                cause: response.httpStatusCode
              }
            )
          );
        }
      } catch (error: any) {
        asyncErrorHandler(
          new Error(
            `PaymentMethodSettings.getAccountSettingsAsync - catch: ${JSON.stringify(error)}`,
            {
              cause: error.message
            }
          )
        );
      }

      setIsLoading(false);
    };
    if (isFocused) {
      getAccountSettingsAsync();
    }
  }, [asyncErrorHandler, authCtx.token?.access_token, isFocused]);

  return (
    <>
      {isLoading && (
        <ActivityIndicator
          color={Colors.primary800}
          size={120}
          style={{
            flex: 1,
            position: 'absolute',
            left: 0,
            right: 0,
            top: 0,
            bottom: 0,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: Colors.tertiary900Op12,
            zIndex: 2000
          }}
        />
      )}
      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => {}}
        wrapperStyle={{
          zIndex: 7000,
          top: yPosition,
          alignContent: 'center',
          alignItems: 'center'
        }}
        style={{
          backgroundColor: Colors.secondary500,
          alignSelf: 'center'
        }}
      >
        Alterações salvas com sucesso!
      </Snackbar>

      <View style={{ marginVertical: 20, paddingLeft: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.primary500 }}>
          Selecione o método de pagamento:
        </Text>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.keyboardAwareStyle}
        onScroll={(event) => {
          setYPosition(event.nativeEvent.contentOffset.y);
        }}
      >
        <View style={styles.buttons}>
          <Button
            type={ButtonTypes.Primary_Bordered}
            onPress={submitHandler}
            text={styles.buttonTextStyles}
            pressable={[styles.buttonPressable]}
          >
            {authCtx.userInfo?.userCreationCompleted ? 'Salvar' : 'Próximo'}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default PaymentMethodSettings;

const styles = StyleSheet.create({
  keyboardAwareStyle: {
    padding: 30
  },
  buttons: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 30,
    marginTop: 15,
    marginRight: 20
  },
  buttonPressable: {
    flex: 1,
    marginHorizontal: 3,
    minHeight: 40
  },
  buttonTextStyles: { fontSize: 20 }
});
