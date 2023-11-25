import PaymentMethods from '../../constants/enums/PaymentMethods';
import PaymentsUserMethodStatus from '../../constants/enums/PaymentsUserMethodStatus';
import { Colors } from '../../constants/styles';
import useAsyncErrorHandler from '../../hooks/useAsyncErrorHandler';
import { getAccountSettings, updateAccountSettings } from '../../http/SettingsApi';
import GetAccountSettingsResponse from '../../models/settings/accounts/GetAccountSettingsResponse';
import {
  GetCreditCardPaymentMethodResponse,
  GetUserPaymentMethodResponse
} from '../../models/settings/payments/GetPaymentUserMethodResponse';
import { AuthContext } from '../../store/auth-context';
import CreditCard from '../ui/CreditCard';
import PaymentInstalmentsList from './Payment/PaymentInstalmentsList';
import UpdateAccountSettingsRequest from '/models/settings/accounts/UpdateAccountSettingsRequest';

import { FontAwesome5 } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

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

  useEffect(() => {
    const updateAccountSettingsAsync = async (account: GetAccountSettingsResponse) => {
      setIsLoading(true);

      const request = { ...accountSettingsFromServer } as unknown as UpdateAccountSettingsRequest;
      request.userCreationCompleted = true;

      try {
        const response = await updateAccountSettings(authCtx.token?.access_token!, request);
        if (response.ok) {
        } else {
          asyncErrorHandler(
            new Error(
              `FirstLoginWizardCompleted.updateAccountSettingsAsync - else: ${JSON.stringify(
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
            `FirstLoginWizardCompleted.updateAccountSettingsAsync - catch: ${JSON.stringify(
              error
            )}`,
            {
              cause: error.message
            }
          )
        );
      }

      setIsLoading(false);
    };

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
          updateAccountSettingsAsync(getAccountSettingsResponse);
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
  }, [accountSettingsFromServer, asyncErrorHandler, authCtx.token?.access_token, isFocused]);

  useLayoutEffect(() => {
    if (!navigation || navigation === undefined) return;

    navigation.setOptions({ headerShown: false });

    const MainDrawerNavigator = navigation.getParent('MainDrawerNavigator');
    if (MainDrawerNavigator) {
      MainDrawerNavigator.setOptions({
        headerTitle: 'Cadastro Finalizado',
        headerShown: true
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

      <PaymentInstalmentsList
        navigation={navigation}
        instalmentsProp={accountSettingsFromServer?.instalments}
      />
    </>
  );
};

export default FirstLoginWizardCompleted;
