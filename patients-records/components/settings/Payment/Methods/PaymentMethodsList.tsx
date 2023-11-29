import { Colors } from '../../../../constants/styles';
import useAsyncErrorHandler from '../../../../hooks/useAsyncErrorHandler';
import { getUserPaymentMethods } from '../../../../http/PaymentsApi';
import GetUserPaymentMethodsResponse from '../../../../models/settings/payments/GetUserPaymentMethodsResponse';
import { AuthContext } from '../../../../store/auth-context';

import { MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

type Props = {
  navigation: any;
};

const PaymentMethodsList: React.FC<Props> = ({ navigation }) => {
  const isFocused = useIsFocused();
  const [isLoading, setIsLoading] = useState(false);
  const asyncErrorHandler = useAsyncErrorHandler();
  const authCtx = useContext(AuthContext);

  const [paymentMethods, setPaymentMethods] = useState<GetUserPaymentMethodsResponse | undefined>(
    undefined
  );

  const getUserNotificationsAsync = useCallback(async () => {
    if (authCtx.token?.access_token) {
      setIsLoading(true);
      try {
        const response = await getUserPaymentMethods(authCtx.token.access_token);

        if (response.ok) {
          const body = response.body as GetUserPaymentMethodsResponse;
          setPaymentMethods(body);
        } else {
          asyncErrorHandler(
            new Error(
              `PaymentMethodsList.getUserNotificationsAsync - else: ${JSON.stringify(response)}`,
              {
                cause: response.httpStatusCode
              }
            )
          );
        }
      } catch (error: any) {
        asyncErrorHandler(
          new Error(
            `PaymentMethodsList.getUserNotificationsAsync - catch: ${JSON.stringify(error)}`,
            {
              cause: error.message
            }
          )
        );
      }

      setIsLoading(false);
    }
  }, [asyncErrorHandler, authCtx]);

  useEffect(() => {
    if (isFocused) {
      getUserNotificationsAsync();
    }
  }, [getUserNotificationsAsync, isFocused]);

  return (
    <View style={{ flex: 1 }}>
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
      {paymentMethods?.paymentMethods.map((m) => {
        return (
          <View key={m.paymentUserMethodId}>
            <View style={{ flexDirection: 'row' }}>
              <Text>Tipo: </Text>
              <MaterialIcons name="payment" size={48} color={Colors.primary800} />
            </View>
          </View>
        );
      })}
    </View>
  );
};

export default PaymentMethodsList;
