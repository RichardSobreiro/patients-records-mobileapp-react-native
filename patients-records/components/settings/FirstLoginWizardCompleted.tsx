import Button, { ButtonTypes } from '../../components/ui/Button';
import PaymentMethods from '../../constants/enums/PaymentMethods';
import PaymentsUserMethodStatus from '../../constants/enums/PaymentsUserMethodStatus';
import { Colors } from '../../constants/styles';
import useAsyncErrorHandler from '../../hooks/useAsyncErrorHandler';
import { getAccountSettings } from '../../http/SettingsApi';
import GetAccountSettingsResponse from '../../models/settings/accounts/GetAccountSettingsResponse';
import {
  GetCreditCardPaymentMethodResponse,
  GetUserPaymentMethodResponse
} from '../../models/settings/payments/GetPaymentUserMethodResponse';
import { AuthContext } from '../../store/auth-context';
import CreditCard from '../ui/CreditCard';
import PaymentInstalmentsList from './Payment/PaymentInstalmentsList';

import { FontAwesome5 } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = {
  navigation: any;
};

const FirstLoginWizardCompleted: React.FC<Props> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const asyncErrorHandler = useAsyncErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accountSettingsFromServer, setAccountSettingsFromServer] = useState<
    GetAccountSettingsResponse | undefined
  >(undefined);
  const [defaultPaymentMethod, setDefaultPaymentMethod] = useState<
    GetUserPaymentMethodResponse | undefined
  >(undefined);
  const isFocused = useIsFocused();

  const submitHandler = async () => {};

  useEffect(() => {
    const getAccountSettingsAsync = async () => {
      setIsLoading(true);

      try {
        const response = await getAccountSettings(authCtx.token?.access_token!);
        if (response.ok) {
          const getAccountSettingsResponse = response.body as GetAccountSettingsResponse;
          setAccountSettingsFromServer(getAccountSettingsResponse);
          setDefaultPaymentMethod((curValue) => {
            const defaultPaymentMethodResponse =
              getAccountSettingsResponse.paymentUserMethods?.paymentMethods?.find(
                (pm) =>
                  pm.paymentUserMethodId ===
                  getAccountSettingsResponse.paymentUserMethods?.defaultPaymentUserMethodId
              );
            if (defaultPaymentMethodResponse) {
              return defaultPaymentMethodResponse;
            } else {
              return new GetUserPaymentMethodResponse(
                '',
                '',
                new Date(),
                PaymentMethods.CreditCardRecurrent,
                PaymentsUserMethodStatus.PENDING,
                '',
                new Date(),
                new GetCreditCardPaymentMethodResponse(
                  '***',
                  'Nome Inválido',
                  '**/**',
                  'Inválido',
                  'mastercard'
                )
              );
            }
          });
        } else {
          asyncErrorHandler(
            new Error(
              `FirstLoginWizardCompleted.getAccountSettingsAsync - else: ${JSON.stringify(
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
            `FirstLoginWizardCompleted.getAccountSettingsAsync - catch: ${JSON.stringify(error)}`,
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

  useLayoutEffect(() => {
    if (!navigation || navigation === undefined) return;

    navigation.setOptions({ headerShown: false });

    const MainDrawerNavigator = navigation.getParent('MainDrawerNavigator');
    if (MainDrawerNavigator) {
      MainDrawerNavigator.setOptions({
        headerTitle: 'Cadastro Finalizado'
      });
    }

    return () => {
      navigation.setOptions({ headerShown: true });
    };
  });

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

      <View
        style={{
          marginVertical: 20,
          paddingLeft: 20,
          alignContent: 'center',
          alignItems: 'center'
        }}
      >
        <FontAwesome5 name="check-circle" size={80} color="green" />
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.primary500 }}>
          Tudo certo com o seu cadastro.
        </Text>
      </View>

      <CreditCard
        cvc={defaultPaymentMethod?.creditCard?.cvc}
        name={defaultPaymentMethod?.creditCard?.name}
        expiry={defaultPaymentMethod?.creditCard?.expiry}
        lastFourNumbers={defaultPaymentMethod?.creditCard?.fourFinalNumbers}
        type={defaultPaymentMethod?.creditCard?.type}
      />

      <PaymentInstalmentsList instalmentsProp={accountSettingsFromServer?.instalments} />

      <ScrollView horizontal contentContainerStyle={{ flex: 1, flexDirection: 'column' }}>
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
      </ScrollView>
    </>
  );
};

export default FirstLoginWizardCompleted;

const styles = StyleSheet.create({
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
