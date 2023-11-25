import { Colors } from '../../../constants/styles';
import { formatDatePTBR } from '../../../util/date-helpers';
import GetPaymentInstalmentResponse from '/models/settings/payments/GetPaymentInstalmentResponse';

import { AntDesign } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  navigation: any;
  instalmentsProp?: GetPaymentInstalmentResponse[];
};

const PaymentInstalmentsList: React.FC<Props> = ({ instalmentsProp, navigation }) => {
  const [instalments, setInstalments] = useState<GetPaymentInstalmentResponse[] | undefined>(
    instalmentsProp
  );

  useEffect(() => {
    setInstalments(instalmentsProp);
  }, [instalmentsProp]);

  return (
    <>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Pagamentos</Text>
      </View>
      <View style={styles.table}>
        <View style={styles.headerRow}>
          <View style={[styles.headerCell, { flex: 1 }]}>
            <Text style={styles.headerText}>Nº</Text>
          </View>
          <View style={[styles.headerCell, { flex: 2 }]}>
            <Text style={styles.headerText}>Status</Text>
          </View>
          <View style={[styles.headerCell, { flex: 4 }]}>
            <Text style={styles.headerText}>Validade</Text>
          </View>
          <View style={[styles.headerCell, { flex: 2 }]}>
            <Text style={styles.headerText}>Detalhes</Text>
          </View>
        </View>
        {instalments?.map((it) => (
          <View key={it.paymentInstalmentsId} style={styles.row}>
            <View style={[styles.cell, { flex: 1 }]}>
              <Text style={styles.text}>{it.instalmentNumber}</Text>
            </View>
            <View style={[styles.cell, { flex: 2 }]}>
              <Text style={styles.text}>{it.status}</Text>
            </View>
            <View style={[styles.cell, { flex: 4 }]}>
              <Text style={styles.text}>{formatDatePTBR(it.expireDate)}</Text>
            </View>
            <View style={[styles.cell, { flex: 2 }]}>
              <AntDesign
                name="infocirlceo"
                size={24}
                color={Colors.primary500}
                onPress={() => {
                  navigation.push('PaymentInstalmentsEdit', {
                    paymentInstalmentsId: it.paymentInstalmentsId
                  });
                }}
              />
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

export default PaymentInstalmentsList;

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 5
  },
  title: {
    fontSize: 16,
    color: Colors.primary500
  },
  table: {
    paddingHorizontal: 20
  },
  headerRow: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.primary500,
    flexDirection: 'row',
    justifyContent: 'space-evenly'
  },
  headerCell: {
    alignContent: 'center',
    alignItems: 'center'
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: Colors.primary500
  },
  row: {
    borderRightWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.primary500,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    borderLeftWidth: 1
  },
  cell: {
    paddingVertical: 10,
    alignContent: 'center',
    alignItems: 'center'
  },
  text: {
    color: Colors.primary500
  }
});
