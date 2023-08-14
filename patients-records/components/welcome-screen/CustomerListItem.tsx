//import { formatDistanceToNow } from 'date-fns';
import { Colors } from '../../constants/styles';
import { GetCustomer } from '../../models/GetCustomersResponse';
import { getAgePTBR } from '../../util/date-helpers';
import { DateParser } from '../../util/dateParser';
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';

type Props = {
  item: GetCustomer;
  editPatient: (patientId: string) => void;
};

const PatientListItem: React.FC<Props> = ({ item, editPatient }) => {
  return (
    <TouchableOpacity onPress={editPatient.bind(null, item.customerName, item)}>
      <View style={styles.article}>
        <View style={{ flex: 1 }}>
          <Text style={styles.articleTitle} numberOfLines={3}>
            {item.customerName}
          </Text>

          <Text style={styles.articlePublishedAt}>{item.phoneNumber}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.articleTitle} numberOfLines={3}>
            {getAgePTBR(item.birthDate)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default React.memo(PatientListItem);

const styles = StyleSheet.create({
  article: {
    flexDirection: 'row',
    paddingVertical: 15
  },
  articleImage: {
    width: 150,
    height: 85,
    resizeMode: 'contain',
    marginRight: 15
  },
  articleNoImage: {
    width: 150,
    height: 85,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary500
  },
  articleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  articleDescription: {
    fontSize: 16,
    marginBottom: 10
  },
  articlePublishedAt: {
    fontSize: 14
  },
  patientImage: {
    width: 150,
    height: 85,
    resizeMode: 'contain',
    marginRight: 15
  }
});
