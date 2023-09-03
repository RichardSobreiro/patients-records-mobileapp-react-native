/* eslint-disable import/order */
import ServiceTypesModal from '../../../../ui/ServiceTypesModal';
import DatePickerV2 from '../../../../ui/custom-form/DatePickerV2';
import TimerPicker from '../../../../ui/custom-form/TimerPicker';
import { ErrorType, Inputs, Touched } from '../ServicesList';
import { GetServiceTypeResponse } from 'models/customers/service-types/GetServiceTypesResponse';
import { useState } from 'react';
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

const Step1ServiceInfo: React.FC<Props> = ({
  inputs,
  touched,
  errors,
  changeHandler,
  blurHandler
}) => {
  const [openServiceTypesModal, setOpenServiceTypesModal] = useState<boolean>(false);
  const [selectedServiceTypes, setSelectedServiceTypes] = useState<GetServiceTypeResponse[]>(
    inputs['selectedServiceTypes']?.value ? inputs['selectedServiceTypes']?.value : []
  );

  return (
    <KeyboardAwareScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
    >
      <DatePickerV2
        field="date"
        label="Data do atendimento:"
        values={inputs}
        touched={touched}
        errors={errors}
        onChangeHandler={changeHandler}
        onBlurHandler={blurHandler}
      />
      <TimerPicker
        field="time"
        label="Hora do atendimento:"
        values={inputs}
        touched={touched}
        errors={errors}
        onChangeHandler={changeHandler}
        onBlurHandler={blurHandler}
      />
      <ServiceTypesModal
        errors={errors}
        visible={openServiceTypesModal}
        setVisible={setOpenServiceTypesModal}
        selectedServiceTypes={selectedServiceTypes}
        setSelectedServiceTypes={setSelectedServiceTypes}
        mode="crud"
        onChangeHandler={changeHandler}
        onBlurHandler={blurHandler}
      />
    </KeyboardAwareScrollView>
  );
};

export default Step1ServiceInfo;

const styles = StyleSheet.create({
  content: {
    gap: 20,
    backgroundColor: 'transparent',
    marginBottom: 20
  }
});
