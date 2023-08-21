import { GetServiceResponse } from '../../../models/customers/services/GetServicesResponse';
import { formatDatePTBR, formatTimePTBR } from '../../../util/date-helpers';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Surface } from 'react-native-paper';

type Props = {
  service: GetServiceResponse;
  navigateToUpdateProceeding: (customerId: string, serviceId: string) => void;
};

const ServicesListItem: React.FC<Props> = ({ service, navigateToUpdateProceeding }) => {
  return (
    <TouchableOpacity
      onPress={navigateToUpdateProceeding.bind(null, service.customerId, service.serviceId)}
    >
      <Surface style={styles.surface} elevation={1}>
        <View style={styles.serviceContainer}>
          <View style={{ flex: 1 }}>
            <Text style={styles.serviceText} numberOfLines={3}>
              {service.date ? formatDatePTBR(service.date) : 'Nenhuma data cadastrada'}
            </Text>
            <Text style={styles.serviceText} numberOfLines={3}>
              {service.date ? formatTimePTBR(service.date) : 'Nenhuma data cadastrada'}
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
      </Surface>
    </TouchableOpacity>
  );
};

export default ServicesListItem;

const styles = StyleSheet.create({
  surface: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    padding: 8
  },
  serviceContainer: {
    flexDirection: 'row'
  },
  serviceText: {
    fontSize: 18,
    marginBottom: 10
  },
  serviceNotes: {
    fontSize: 14
  }
});
