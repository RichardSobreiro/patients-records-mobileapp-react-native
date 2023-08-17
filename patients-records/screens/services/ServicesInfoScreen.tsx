import Header from '../../components/welcome-screen/Header';
import Step1ServiceInfo from '../../components/welcome-screen/patients-crud/services-crud/Setp1Step1ServiceInfo';
import { CreateEditProceedingContext } from '../../store/create-edit-proceedings-context';
import { GetProceedingResponse } from 'models/proceedings/GetProceedingResponse';
import { useContext, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';

type Props = {
  route: any;
  navigation: any;
  proceeding?: GetProceedingResponse;
};

const Step1ServiceInfoScreen: React.FC<Props> = ({ route, navigation, proceeding }) => {
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
          isAddingCustomerScreen={true}
          title={`${createEditProceedingCtx.patient?.customerName!}`}
          subtitle={proceeding ? 'Editando Procedimento' : 'Novo Procedimento'}
        />
      </View>
      <Step1ServiceInfo />
    </>
  );
};

export default Step1ServiceInfoScreen;

const styles = StyleSheet.create({
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }
});
