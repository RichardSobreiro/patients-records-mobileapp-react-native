import Button, { ButtonTypes } from '../../../../components/ui/Button';
import PaymentMethods from '../../../../constants/enums/PaymentMethods';
import { Colors } from '../../../../constants/styles';
import useAsyncErrorHandler from '../../../../hooks/useAsyncErrorHandler';
import { createPaymentMethod } from '../../../../http/PaymentsApi';
import CreateUserPaymentMethodRequest, {
  CreateCreditCardPaymentMethodRequest
} from '../../../../models/settings/payments/CreateUserPaymentMethodRequest';
import CreateUserPaymentMethodResponse from '../../../../models/settings/payments/CreateUserPaymentMethodResponse';
import { AuthContext } from '../../../../store/auth-context';
import { NotificationContext } from '../../../../store/notification-context';
import PagSeguro from '../../../../util/payments-providers/pagseguro.js';

import { useContext, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { CreditCardInput } from 'react-native-input-credit-card';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Props = {
  navigation: any;
};

interface PagSeguroType {
  encryptCard: (args: any) => any;
}

const EditPaymentMethod: React.FC<Props> = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  const asyncErrorHandler = useAsyncErrorHandler();
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);
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

  const cciRef = useRef();

  const createUserPaymentMethodAsync = async (): Promise<
    CreateUserPaymentMethodResponse | undefined
  > => {
    if (!paymentForm?.valid) {
      return;
    }
    setIsLoading(true);

    const card = PagSeguro.encryptCard({
      publicKey: process.env.PUBLIC_KEY_PAG_SEGURO,
      holder: paymentForm.values.name,
      number: paymentForm.values.number.replaceAll(' ', ''),
      expMonth: paymentForm.values.expiry.split('/')[0],
      expYear: `20${paymentForm.values.expiry.split('/')[1]}`,
      securityCode: paymentForm.values.cvc
    });

    if (card.hasErrors) {
      let message = 'Verifique os dados do cartão e tente novamente!';
      if (card.errors[0].code === 'INVALID_NUMBER') {
        message = 'Número do cartão é inválido. Verifique os algarismos e tente novamente!';
      }
      notificationCtx.showNotification({
        title: 'Erro ao criptografar o cartão',
        message
      });
    } else {
      const request = new CreateUserPaymentMethodRequest(
        PaymentMethods.CreditCardRecurrent,
        true,
        new CreateCreditCardPaymentMethodRequest(
          paymentForm.values.cvc,
          paymentForm.values.name,
          paymentForm.values.expiry,
          card.encryptedCard,
          paymentForm.values.number.substring(
            paymentForm.values.number.length - 4,
            paymentForm.values.number.length
          ),
          paymentForm.values.type
        )
      );
      try {
        const response = await createPaymentMethod(authCtx.token?.access_token!, request);
        if (response.ok) {
          const reponseBody = response.body as CreateUserPaymentMethodResponse;
          return reponseBody;
        } else {
          asyncErrorHandler(
            new Error(
              `CreatePaymentMethod.createUserPaymentMethodAsync - else: ${JSON.stringify(
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
            `CreatePaymentMethod.createUserPaymentMethodAsync - catch: ${JSON.stringify(error)}`,
            {
              cause: error.message
            }
          )
        );
      }
      setIsLoading(false);
    }
  };

  const onChangeCreditCardInput = (form) => {
    setPaymentForm(form);
  };

  useEffect(() => {
    console.log(cciRef.current);
    cciRef.current.setValues({ number: '**** **** **** 4242' });
  }, []);

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
      <View style={{ marginVertical: 10, paddingLeft: 20 }}>
        <Text style={{ fontSize: 16, fontWeight: 'bold', color: Colors.primary500 }}>
          Não se preocupe! Seus dados de pagamento são trafegados totalmente criptografados pelo
          nosso parceiro processador de pagamentos (Pagbank).
        </Text>
      </View>

      <KeyboardAwareScrollView contentContainerStyle={styles.keyboardAwareStyle}>
        <CreditCardInput
          ref={cciRef}
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
            onPress={createUserPaymentMethodAsync}
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

export default EditPaymentMethod;
