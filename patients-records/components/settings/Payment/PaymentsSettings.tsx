import { TouchableOpacity } from 'react-native-gesture-handler';

import CreditCard from '../../../components/ui/CreditCard';
import PaymentInstalmentsStatus from '../../../constants/enums/PaymentInstalmentsStatus';
import PaymentMethods from '../../../constants/enums/PaymentMethods';
import PaymentsUserMethodStatus from '../../../constants/enums/PaymentsUserMethodStatus';
import { Colors } from '../../../constants/styles';
import useAsyncErrorHandler from '../../../hooks/useAsyncErrorHandler';
import { getAccountSettings } from '../../../http/SettingsApi';
import GetAccountSettingsResponse from '../../../models/settings/accounts/GetAccountSettingsResponse';
import {
  GetCreditCardPaymentMethodResponse,
  GetUserPaymentMethodResponse
} from '../../../models/settings/payments/GetUserPaymentMethodsResponse';
import { AuthContext } from '../../../store/auth-context';
import PaymentInstalmentsList from './PaymentInstalmentsList';

import { FontAwesome5, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

type Props = { navigation: any };

const PaymentsSettings: React.FC<Props> = ({ navigation }) => {
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
              `PaymentsSettings.getAccountSettingsAsync - else: ${JSON.stringify(response)}`,
              {
                cause: response.httpStatusCode
              }
            )
          );
        }
      } catch (error: any) {
        asyncErrorHandler(
          new Error(`PaymentsSettings.getAccountSettingsAsync - catch: ${JSON.stringify(error)}`, {
            cause: error.message
          })
        );
      }

      setIsLoading(false);
    };
    if (isFocused) {
      getAccountSettingsAsync();
    }
  }, [asyncErrorHandler, authCtx, isFocused]);

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
        {accountSettingsFromServer?.paymentStatus === PaymentInstalmentsStatus.OK ? (
          <FontAwesome5 name="check-circle" size={80} color="green" />
        ) : (
          <MaterialIcons name="error" size={80} color={Colors.error500} />
        )}
        <Text
          style={{
            fontSize: 18,
            fontWeight: 'bold',
            color:
              accountSettingsFromServer?.paymentStatus === PaymentInstalmentsStatus.OK
                ? Colors.primary500
                : Colors.error500,
            textAlign: 'center'
          }}
        >
          {accountSettingsFromServer?.paymentStatus === PaymentInstalmentsStatus.PENDING &&
            'O seu pagamento venceu. Tente realizar um novo pagamento.'}
          {accountSettingsFromServer?.paymentStatus === PaymentInstalmentsStatus.ERROR &&
            'Existe um problema com o seu último pagamento. Verifique seu cartão de crédito!'}
          {accountSettingsFromServer?.paymentStatus === PaymentInstalmentsStatus.OK &&
            'Tudo certo com o seu pagamento.'}
        </Text>
      </View>

      <CreditCard
        cvc={defaultPaymentMethod?.creditCard?.cvc}
        name={defaultPaymentMethod?.creditCard?.name}
        expiry={defaultPaymentMethod?.creditCard?.expiry}
        lastFourNumbers={defaultPaymentMethod?.creditCard?.fourFinalNumbers}
        type={defaultPaymentMethod?.creditCard?.type}
      />

      <TouchableOpacity
        style={{
          margin: 20,
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginHorizontal: 20,
          padding: 10,
          borderWidth: 1,
          borderColor: Colors.primary500,
          borderRadius: 20
        }}
        onPress={() => {
          navigation.navigate('CreatePaymentMethodScreen');
        }}
      >
        <MaterialCommunityIcons
          name="credit-card-sync"
          size={24}
          color={Colors.primary500}
          style={{ marginRight: 10 }}
        />
        <Text style={{ color: Colors.primary500, fontWeight: 'bold', fontSize: 18 }}>
          Substituir cartão de crédito
        </Text>
      </TouchableOpacity>

      <PaymentInstalmentsList
        navigation={navigation}
        instalmentsProp={accountSettingsFromServer?.instalments}
      />
    </>
  );
};

export default PaymentsSettings;
