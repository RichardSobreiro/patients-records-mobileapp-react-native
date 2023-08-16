import { GetServiceResponse } from '../../../models/customers/services/GetServicesResponse';
import { formatDatePTBR, formatTimePTBR } from '../../../util/date-helpers';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = {
  service: GetServiceResponse;
  navigateToUpdateProceeding: (customerId: string, serviceId: string) => void;
};

const ServicesListItem: React.FC<Props> = ({ service, navigateToUpdateProceeding }) => {
  return (
    <TouchableOpacity
      onPress={navigateToUpdateProceeding.bind(null, service.customerId, service.serviceId)}
    >
      <View style={styles.serviceContainer}>
        <View style={{ flex: 1 }}>
          <Text style={styles.serviceText} numberOfLines={3}>
            {service.date ? formatDatePTBR(new Date(service.date)) : 'Nenhuma data cadastrada'}
          </Text>
          <Text style={styles.serviceText} numberOfLines={3}>
            {service.date ? formatTimePTBR(new Date(service.date)) : 'Nenhuma data cadastrada'}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          {service.serviceTypes.map((item) => {
            return (
              <Text style={styles.serviceText} numberOfLines={3}>
                {item.serviceTypeDescription}
              </Text>
            );
          })}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ServicesListItem;

const styles = StyleSheet.create({
  serviceContainer: {
    flexDirection: 'row',
    paddingVertical: 15
  },
  serviceText: {
    fontSize: 18,
    marginBottom: 10
  },
  serviceNotes: {
    fontSize: 14
  }
});
