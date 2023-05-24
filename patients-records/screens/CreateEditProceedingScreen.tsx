import Header from '../components/welcome-screen/Header';
import CreateEditPatientsProceedings from '../components/welcome-screen/patients-crud/CreateEditPatientsProceedings';
import { View, StyleSheet } from 'react-native';

type Props = {
  route: any;
  navigation: any;
};

const CreateEditProceedingScreen: React.FC<Props> = ({ route, navigation }) => {
  const { patient } = route.params;

  return (
    <>
      <View style={styles.header}>
        <Header
          isAddingPatientScreen={true}
          title={`${patient?.patientName!}`}
          subtitle="Novo Procedimentos"
        />
      </View>
      <CreateEditPatientsProceedings patient={patient} />
    </>
  );
};

export default CreateEditProceedingScreen;

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
