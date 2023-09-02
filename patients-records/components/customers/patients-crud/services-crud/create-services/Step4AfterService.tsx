/* eslint-disable import/order */
import { GetServiceTypeResponse } from '../../../../../models/customers/service-types/GetServiceTypesResponse';
import FileCustom from '../../../../../util/types/FileCustom';
import RichTextInput from '../../../../ui/custom-form/RichTextInput';
import { ErrorType, Inputs, Touched } from '../ServicesList';
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

const Step4AfterService: React.FC<Props> = ({
  inputs,
  touched,
  errors,
  changeHandler,
  blurHandler
}) => {
  return (
    // <KeyboardAwareScrollView
    //   showsVerticalScrollIndicator={true}
    //   extraHeight={400}
    //   extraScrollHeight={400}
    // >
    <RichTextInput
      field="afterComments"
      label="Queixas e comentários após o atendimento"
      values={inputs}
      touched={touched}
      errors={errors}
      onChangeHandler={changeHandler}
      onBlurHandler={blurHandler}
    />
    // </KeyboardAwareScrollView>
  );
};

export default Step4AfterService;
