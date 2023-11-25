import CreditCard from '../../../components/ui/CreditCard';
import { Colors } from '../../../constants/styles';
import useAsyncErrorHandler from '../../../hooks/useAsyncErrorHandler';
import { getPaymentInstalment } from '../../../http/PaymentsApi';
import GetPaymentInstalmentResponse from '../../../models/settings/payments/GetPaymentInstalmentResponse';
import { AuthContext } from '../../../store/auth-context';
import { convertPaymentMethodToString } from '../../../util/constantsToStrings';
import { formatDatePTBR } from '../../../util/date-helpers';

import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

type Props = {
  navigation: any;
  paymentInstalmentsId: string;
};

const PaymentInstalmentsEdit: React.FC<Props> = ({ navigation, paymentInstalmentsId }) => {
  const authCtx = useContext(AuthContext);
  const asyncErrorHandler = useAsyncErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isFocused = useIsFocused();
  const [instalment, setInstalment] = useState<GetPaymentInstalmentResponse | undefined>(undefined);

  useEffect(() => {
    const getPaymentInstalmentAsync = async () => {
      setIsLoading(true);

      try {
        const response = await getPaymentInstalment(
          authCtx.token?.access_token!,
          paymentInstalmentsId
        );
        if (response.ok) {
          const getPaymentInstalmentResponse = response.body as GetPaymentInstalmentResponse;
          setInstalment(getPaymentInstalmentResponse);
        } else {
          asyncErrorHandler(
            new Error(
              `PaymentInstalmentsEdit.getPaymentInstalmentAsync - else: ${JSON.stringify(
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
            `PaymentInstalmentsEdit.getPaymentInstalmentAsync - catch: ${JSON.stringify(error)}`,
            {
              cause: error.message
            }
          )
        );
      }

      setIsLoading(false);
    };
    if (isFocused) {
      getPaymentInstalmentAsync();
    }
  }, [asyncErrorHandler, authCtx.token?.access_token, isFocused, paymentInstalmentsId]);

  useLayoutEffect(() => {
    if (!navigation) return;

    navigation.setOptions({
      headerTitle: `Pagamento ${instalment?.instalmentNumber}`
    });

    const mainDrawerNavigator = navigation.getParent('MainDrawerNavigator');
    if (mainDrawerNavigator) {
      mainDrawerNavigator.setOptions({
        headerShown: false
      });
    }

    return () => {
      mainDrawerNavigator.setOptions({
        headerShown: true
      });
    };
  }, [instalment?.instalmentNumber, navigation]);

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

      <View style={styles.container}>
        <View style={[styles.row, { flexDirection: 'row', justifyContent: 'space-between' }]}>
          <View>
            <Text style={styles.label}>Data:</Text>
            <Text style={styles.value}>{formatDatePTBR(instalment?.creationDate)}</Text>
          </View>
          <View>
            <Text style={styles.label}>Validade:</Text>
            <Text style={styles.value}>{formatDatePTBR(instalment?.expireDate)}</Text>
          </View>
          <View>
            <Text style={styles.label}>Status:</Text>
            <Text style={styles.value}>{instalment?.status}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Observações:</Text>
          <Text style={styles.value}>{instalment?.statusDescription}</Text>
        </View>

        <View style={styles.rowCreditCard}>
          <Text style={[styles.label, { paddingHorizontal: 15 }]}>Método de Pagamento:</Text>
          <Text style={[styles.value, { paddingHorizontal: 15 }]}>
            {convertPaymentMethodToString(instalment?.paymentMethod?.paymentMethodId)}
          </Text>
          <Text
            style={[
              styles.label,
              { fontSize: 12, fontStyle: 'italic', paddingHorizontal: 15, marginBottom: 15 }
            ]}
          >
            Todo mês será lançado o valor de R$ 19,90 na fatura do seu cartão!
          </Text>
          <CreditCard
            cvc={instalment?.paymentMethod?.creditCard?.cvc}
            name={instalment?.paymentMethod?.creditCard?.name}
            expiry={instalment?.paymentMethod?.creditCard?.expiry}
            lastFourNumbers={instalment?.paymentMethod?.creditCard?.fourFinalNumbers}
            type={instalment?.paymentMethod?.creditCard?.type}
          />
        </View>
      </View>
    </>
  );
};

export default PaymentInstalmentsEdit;

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  row: {
    columnGap: 20,
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.primary800,
    borderRadius: 20
  },
  label: {
    color: Colors.primary500,
    fontSize: 14
  },
  value: {
    color: Colors.primary500,
    fontSize: 16,
    fontWeight: 'bold'
  },
  rowCreditCard: {
    paddingVertical: 5,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: Colors.primary800,
    borderRadius: 20
  }
});
