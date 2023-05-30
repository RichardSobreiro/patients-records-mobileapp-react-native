import Header from '../../components/welcome-screen/Header';
import ProceedingsInfo from '../../components/welcome-screen/patients-crud/proceedings-crud/ProceedingsInfo';
import { CreateEditProceedingContext } from '../../store/create-edit-proceedings-context';
import { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  route: any;
  navigation: any;
};

const ProceedingsInfoScreen: React.FC<Props> = ({ route, navigation }) => {
  const createEditProceedingCtx = useContext(CreateEditProceedingContext);

  return (
    <>
      <View style={styles.header}>
        <Header
          isAddingPatientScreen={true}
          title={`${createEditProceedingCtx.patient?.patientName!}`}
          subtitle="Novo Procedimento"
        />
      </View>
      <ProceedingsInfo />
    </>
  );
};

export default ProceedingsInfoScreen;

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
