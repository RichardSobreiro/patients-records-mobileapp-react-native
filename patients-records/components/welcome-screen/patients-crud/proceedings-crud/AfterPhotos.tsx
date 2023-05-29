/* eslint-disable import/order */
import { Colors } from '../../../../constants/styles';
import { CreateEditProceedingContext } from '../../../../store/create-edit-proceedings-context';
import PatientPhotos from '../PatientPhotos';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const AfterPhotos: React.FC = () => {
  const createEditProceedingCtx = useContext(CreateEditProceedingContext);
  return (
    <KeyboardAwareScrollView
      style={styles.content}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
    >
      <PatientPhotos
        field="afterPhotos"
        title="Fotos do Depois"
        handleChange={createEditProceedingCtx.handleChange}
        values={createEditProceedingCtx.inputs}
      />
    </KeyboardAwareScrollView>
  );
};

export default AfterPhotos;

const styles = StyleSheet.create({
  content: {
    backgroundColor: Colors.primary800,
    marginTop: 20,
    marginBottom: 15,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4
  }
});
