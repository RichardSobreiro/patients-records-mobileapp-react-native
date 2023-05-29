import Header from '../../components/welcome-screen/Header';
import AfterPhotos from '../../components/welcome-screen/patients-crud/proceedings-crud/AfterPhotos';
import { CreateEditProceedingContext } from '../../store/create-edit-proceedings-context';
import { useContext } from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  route: any;
  navigation: any;
};

const AfterPhotosScreen: React.FC<Props> = ({ route, navigation }) => {
  const createEditProceedingCtx = useContext(CreateEditProceedingContext);
  return (
    <>
      <View style={styles.header}>
        <Header
          isAddingPatientScreen={true}
          title={`${createEditProceedingCtx.patient?.patientName!}`}
          subtitle="Novo Procedimentos"
        />
      </View>
      <AfterPhotos />
    </>
  );
};

export default AfterPhotosScreen;

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
