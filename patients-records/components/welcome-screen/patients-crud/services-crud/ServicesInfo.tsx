/* eslint-disable import/order */
import { Colors } from '../../../../constants/styles';
import DatePicker from '../../../ui/custom-form/DatePicker';
import DatePickerV2 from '../../../ui/custom-form/DatePickerV2';
import TimerPicker from '../../../ui/custom-form/TimerPicker';
import { ErrorType, Inputs, Touched } from './CreateService';
import { GetServiceTypeResponse } from 'models/customers/service-types/GetServiceTypesResponse';
import { StyleSheet } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FileCustom from 'util/types/FileCustom';

type Props = {
  inputs: Inputs;
  touched: Touched;
  errors: ErrorType;
  changeHandler: (
    field: string,
    enteredValue: string | Date | GetServiceTypeResponse[] | FileCustom[] | undefined
  ) => void;
  blurHandler: (field: string) => void;
};

const ServicesInfo: React.FC<Props> = ({ inputs, touched, errors, changeHandler, blurHandler }) => {
  return (
    <KeyboardAwareScrollView
      style={styles.content}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
    >
      {/* <DatePicker
        field="date"
        label="Data do Atendimento"
        values={inputs}
        touched={touched}
        errors={errors}
        onChangeHandler={changeHandler}
      /> */}
      <DatePickerV2
        field="date"
        label="Data do Atendimento"
        values={inputs}
        touched={touched}
        errors={errors}
        onChangeHandler={changeHandler}
        onBlurHandler={blurHandler}
      />
      <TimerPicker
        field="time"
        label="Hora do Atendimento"
        values={inputs}
        touched={touched}
        errors={errors}
        onChangeHandler={changeHandler}
        onBlurHandler={blurHandler}
      />
    </KeyboardAwareScrollView>
  );
};

export default ServicesInfo;

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'transparent',
    marginTop: 10,
    marginBottom: 15,
    padding: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0.1, height: 0.1 },
    shadowOpacity: 0.35,
    shadowRadius: 1
  }
});
