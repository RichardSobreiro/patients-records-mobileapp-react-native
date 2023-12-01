import { Colors } from '../../../../constants/styles';
import useAsyncErrorHandler from '../../../../hooks/useAsyncErrorHandler';
import { getUserPaymentMethods } from '../../../../http/PaymentsApi';
import GetUserPaymentMethodsResponse from '../../../../models/settings/payments/GetUserPaymentMethodsResponse';
import { AuthContext } from '../../../../store/auth-context';
import { formatDatePTBR } from '../../../../util/date-helpers';

import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useCallback, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';

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
      {paymentMethods && paymentMethods?.paymentMethods.length > 0 ? (
        <>
          <TouchableOpacity
            style={{
              margin: 20,
              flexDirection: 'row',
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
            <AntDesign
              name="plus"
              size={24}
              color={Colors.primary500}
              style={{ marginRight: 10 }}
            />
            <Text style={{ color: Colors.primary500, fontWeight: 'bold', fontSize: 18 }}>
              Novo meio de pagamento
            </Text>
          </TouchableOpacity>
        </>
      ) : (
        <></>
      )}
      {paymentMethods?.paymentMethods.map((m) => {
        return (
          <TouchableOpacity
            key={m.paymentUserMethodId}
            style={{
              marginHorizontal: 20,
              padding: 10,
              borderWidth: 1,
              borderColor: Colors.primary500,
              borderRadius: 20
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{}}>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: Colors.primary500, fontSize: 16 }}>Tipo:</Text>
                  <Text
                    style={{
                      color: Colors.primary500,
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginLeft: 10
                    }}
                  >
                    Cartão de Crédito
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: Colors.primary500, fontSize: 16 }}>Cadastrado em:</Text>
                  <Text
                    style={{
                      color: Colors.primary500,
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginLeft: 10
                    }}
                  >
                    {formatDatePTBR(m.creationDate)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: Colors.primary500, fontSize: 16 }}>Expira em:</Text>
                  <Text
                    style={{
                      color: Colors.primary500,
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginLeft: 10
                    }}
                  >
                    {formatDatePTBR(m.expireDate)}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: Colors.primary500, fontSize: 16 }}>Status:</Text>
                  <Text
                    style={{
                      color: Colors.primary500,
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginLeft: 10
                    }}
                  >
                    {m.status}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text
                    style={{
                      color: Colors.primary500,
                      fontSize: 16,
                      fontWeight: 'bold',
                      marginLeft: 10
                    }}
                  >
                    {m.statusDescription}
                  </Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row' }}>
                <MaterialIcons name="payment" size={48} color={Colors.primary800} />
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default PaymentMethodsList;
