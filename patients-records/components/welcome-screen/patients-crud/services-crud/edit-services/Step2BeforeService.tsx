/* eslint-disable import/order */
import { GetServiceTypeResponse } from '../../../../../models/customers/service-types/GetServiceTypesResponse';
import FileCustom from '../../../../../util/types/FileCustom';
import RichTextInput from '../../../../ui/custom-form/RichTextInput';
import { ErrorType, Inputs, Touched } from '../../ServicesList';
import { StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

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

const Step2BeforeService: React.FC<Props> = ({
  inputs,
  touched,
  errors,
  changeHandler,
  blurHandler
}) => {
  return (
    <View style={styles.content}>
      <RichTextInput
        field="beforeComments"
        label="Queixas e anotações anteriores ao atendimento"
        values={inputs}
        touched={touched}
        errors={errors}
        onChangeHandler={changeHandler}
        onBlurHandler={blurHandler}
      />
    </View>
  );
};

export default Step2BeforeService;

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'transparent',
    marginBottom: 15,
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 16,
    borderRadius: 8,
    elevation: 1,
    shadowColor: '#000000',
    shadowOffset: { width: 0.1, height: 0.1 },
    shadowOpacity: 0.35,
    shadowRadius: 1
  }
});
