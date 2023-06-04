import Header from '../../components/welcome-screen/Header';
import BeforePhotos from '../../components/welcome-screen/patients-crud/proceedings-crud/BeforePhotos';
import { GetProceedingResponse } from '../../models/proceedings/GetProceedingResponse';
import { CreateEditProceedingContext } from '../../store/create-edit-proceedings-context';
import { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  route: any;
  navigation: any;
  proceeding?: GetProceedingResponse;
};

const BeforePhotosScreen: React.FC<Props> = ({ route, navigation, proceeding }) => {
  const createEditProceedingCtx = useContext(CreateEditProceedingContext);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (
        proceeding &&
        createEditProceedingCtx!.proceeding?.proceedingId !== proceeding!.proceedingId
      ) {
        createEditProceedingCtx.updateState(proceeding!);
      }
    });
    return unsubscribe;
  }, [createEditProceedingCtx, navigation, proceeding]);

  return (
    <>
      <View style={styles.header}>
        <Header
          isAddingPatientScreen={true}
          title={`${createEditProceedingCtx.patient?.patientName!}`}
          subtitle="Novo Procedimento"
        />
      </View>
      <BeforePhotos />
    </>
  );
};

export default BeforePhotosScreen;

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
