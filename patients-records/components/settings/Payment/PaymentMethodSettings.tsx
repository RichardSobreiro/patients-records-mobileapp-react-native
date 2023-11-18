import PaymentMethods from '../../../constants/enums/PaymentMethods';
import Plans from '../../../constants/enums/Plans';
import { Colors } from '../../../constants/styles';
import useAsyncErrorHandler from '../../../hooks/useAsyncErrorHandler';
import { getAccountSettings, updateAccountSettings } from '../../../http/SettingsApi';
import GetAccountSettingsResponse from '../../../models/settings/accounts/GetAccountSettingsResponse';
import UpdateAccountSettingsRequest, {
  CreditCard
} from '../../../models/settings/accounts/UpdateAccountSettingsRequest';
import { AuthContext } from '../../../store/auth-context';
import Button, { ButtonTypes } from '../../ui/Button';

import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { CreditCardInput } from 'react-native-input-credit-card';
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
  //let refCCInput = useRef<CreditCardInput | null>();
  //let refCCInput = createRef<CreditCardInput | null>();
  const [paymentForm, setPaymentForm] = useState<
    | {
        status: {
          cvc: string;
          expiry: string;
          name: string;
          number: string;
        };
        valid: boolean;
        values: {
          cvc: string;
          expiry: string;
          name: string;
          number: string;
          type: string | undefined;
        };
      }
    | undefined
  >(undefined);

  const onChangeCreditCardInput = (form) => {
    setPaymentForm(form);
  };

  const submitHandler = async () => {
    if (!paymentForm?.valid) {
      return;
    }

    setIsLoading(true);

    const request = { ...accountSettingsFromServer } as unknown as UpdateAccountSettingsRequest;
    request.paymentMethod = {
      paymentMethodId: PaymentMethods.CreditCard,
      creditCard: paymentForm.values as unknown as CreditCard
    };

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
          // setPaymentForm(
          //   getAccountSettingsResponse.paymentMethod &&
          //     getAccountSettingsResponse.paymentMethod.paymentMethodId === PaymentMethods.CreditCard
          //     ? {
          //         status: {
          //           cvc: 'complete',
          //           expiry: 'complete',
          //           name: 'complete',
          //           number: 'complete'
          //         },
          //         valid: true,
          //         values: {
          //           cvc: '***',
          //           expiry: getAccountSettingsResponse.paymentMethod.creditCard?.expiry!,
          //           name: getAccountSettingsResponse.paymentMethod.creditCard?.name!,
          //           number: `***`,
          //           type: getAccountSettingsResponse.paymentMethod.creditCard?.number!
          //         }
          //       }
          //     : {
          //         status: {
          //           cvc: 'incomplete',
          //           expiry: 'incomplete',
          //           name: 'incomplete',
          //           number: 'incomplete'
          //         },
          //         valid: false,
          //         values: { cvc: '', expiry: '', name: '', number: '', type: undefined }
          //       }
          // );
          // refCCInput.current?.setValues({ number: '123' });
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

      <View style={{ marginVertical: 10, paddingLeft: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.primary500 }}>
          Não se preocupe! Seus dados de pagamento são trafegados totalmente criptografados pelo
          nosso parceiro processador de pagamentos (Pagbank).
        </Text>
      </View>
      <View style={{ marginVertical: 10, paddingLeft: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.primary500 }}>
          Além disso, apenas R$ 20 do seu limite será reservado todo mês. Não ocupamos o limite do
          seu cartão de crédito.
        </Text>
      </View>

      <KeyboardAwareScrollView
        contentContainerStyle={styles.keyboardAwareStyle}
        onScroll={(event) => {
          setYPosition(event.nativeEvent.contentOffset.y);
        }}
      >
        <CreditCardInput
          // eslint-disable-next-line no-return-assign
          //ref={(c) => (refCCInput.current = c)}
          onChange={onChangeCreditCardInput}
          requiresName={true}
          requiresCVC={true}
          allowScroll={true}
          labels={{
            name: 'NOME NO CARTÃO',
            number: 'NÚMERO DO CARTÃO',
            expiry: 'DATA DE EXPIRAÇÃO',
            postalCode: 'CEP DO PORTADOR',
            cvc: 'CVC'
          }}
          placeholders={{
            name: 'Nome',
            number: 'Número',
            expiry: 'Data de expiração',
            postalCode: 'CEP',
            cvc: 'CVC'
          }}
          additionalInputsProps={{
            name: {
              defaultValue: 'Teste'
            }
          }}
        />
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
