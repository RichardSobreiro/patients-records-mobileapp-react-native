/* eslint-disable import/order */
import { GetServiceTypeResponse } from '../../../../../models/customers/service-types/GetServiceTypesResponse';
import FileCustom from '../../../../../util/types/FileCustom';
import RichTextInput from '../../../../ui/custom-form/RichTextInput';
import { ErrorType, Inputs, Touched } from '../ServicesList';

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
    <RichTextInput
      field="afterComments"
      label="Observações:"
      values={inputs}
      touched={touched}
      errors={errors}
      onChangeHandler={changeHandler}
      onBlurHandler={blurHandler}
    />
  );
};

export default Step4AfterService;
