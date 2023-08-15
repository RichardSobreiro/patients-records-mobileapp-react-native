import Header from '../components/welcome-screen/Header';
import ServicesList from '../components/welcome-screen/patients-crud/ServicesList';
import { View, StyleSheet } from 'react-native';

type Props = {
  route: any;
  navigation: any;
};

const ServicesListScreen: React.FC<Props> = ({ route, navigation }) => {
  const { patient, refresh } = route.params;

  return (
    <>
      <View style={styles.header}>
        <Header
          isAddingCustomerScreen={true}
          title={`${patient?.patientName!}`}
          subtitle="Procedimentos"
        />
      </View>
      <ServicesList patient={patient} refresh={refresh} />
    </>
  );
};

export default ServicesListScreen;

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
