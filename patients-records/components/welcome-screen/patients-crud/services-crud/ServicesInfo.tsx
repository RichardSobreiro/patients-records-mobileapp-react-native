/* eslint-disable import/order */
import { Colors } from '../../../../constants/styles';
import { CreateEditProceedingContext } from '../../../../store/create-edit-proceedings-context';
import DatePicker from '../../../ui/custom-form/DatePicker';
import Input from '../../../ui/custom-form/Input';
import { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const ServicesInfo: React.FC = () => {
  const createEditProceedingCtx = useContext(CreateEditProceedingContext);

  return (
    <KeyboardAwareScrollView
      style={styles.content}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
    >
      <DatePicker
        field="date"
        label="Data do Procedimento"
        values={createEditProceedingCtx.inputs}
        touched={createEditProceedingCtx.touched}
        errors={createEditProceedingCtx.errors}
        onChangeHandler={createEditProceedingCtx.handleChange}
      />
      <Input
        field="type"
        label="Tipo"
        values={createEditProceedingCtx.inputs}
        touched={createEditProceedingCtx.touched}
        errors={createEditProceedingCtx.errors}
        onChangeHandler={createEditProceedingCtx.handleChange}
        onBlurHandler={createEditProceedingCtx.handleBlur}
      />
      <Input
        field="notes"
        label="Observações Gerais"
        values={createEditProceedingCtx.inputs}
        touched={createEditProceedingCtx.touched}
        errors={createEditProceedingCtx.errors}
        onChangeHandler={createEditProceedingCtx.handleChange}
        onBlurHandler={createEditProceedingCtx.handleBlur}
        textInputConfig={{ multiline: true }}
      />
    </KeyboardAwareScrollView>
  );
};

export default ServicesInfo;

const styles = StyleSheet.create({
  patientInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginBottom: 50,
    marginTop: 15
  },
  patientInfoText: {
    fontSize: 24,
    textAlign: 'center'
  },
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
