/* eslint-disable import/order */
import { GetServiceTypeResponse } from '../../../../../models/customers/service-types/GetServiceTypesResponse';
import FileCustom from '../../../../../util/types/FileCustom';
import CustomerPhotos from '../../CustomerPhotos';
import { ErrorType, Inputs, Touched } from '../../ServicesList';

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

const Step3BeforeServicePhotos: React.FC<Props> = ({
  inputs,
  touched,
  errors,
  changeHandler,
  blurHandler
}) => {
  return (
    <CustomerPhotos
      field="beforePhotos"
      title="Fotos do Antes"
      handleChange={changeHandler}
      values={inputs}
    />
  );
};

export default Step3BeforeServicePhotos;
