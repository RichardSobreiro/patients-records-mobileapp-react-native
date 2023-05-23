import Header from '../components/welcome-screen/Header';
import ProceedingsList from '../components/welcome-screen/patients-crud/ProceedingsList';
import { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  route: any;
  navigation: any;
};

const ProceedingsListScreen: React.FC<Props> = ({ route, navigation }) => {
  const { patient } = route.params;

  return (
    <>
      <View style={styles.header}>
        <Header
          isAddingPatientScreen={true}
          title={`${patient?.patientName!}`}
          subtitle="Procedimentos"
        />
      </View>
      <ProceedingsList patient={patient} />
    </>
  );
};

export default ProceedingsListScreen;

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
