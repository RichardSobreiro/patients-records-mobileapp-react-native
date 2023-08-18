/* eslint-disable import/order */
import { createService } from '../../../../../http/ServicesApi';
import { GetServiceTypeResponse } from '../../../../../models/customers/service-types/GetServiceTypesResponse';
import { CreateServiceRequest } from '../../../../../models/customers/services/CreateServiceRequest';
import { AuthContext } from '../../../../../store/auth-context';
import { NotificationContext } from '../../../../../store/notification-context';
import { isValidDate } from '../../../../../util/date-helpers';
import FileCustom from '../../../../../util/types/FileCustom';
import LoadingOverlay from '../../../../ui/LoadingOverlay';
import StackSheetCustom from '../../../../ui/custom-form/StackSheetCustom';
import { ErrorType, Inputs, Touched } from '../../ServicesList';
import Step1ServiceInfo from './Setp1ServicesInfo';
import Step2BeforeService from './Step2BeforeService';
import Step3BeforeServicePhotos from './Step3BeforeServicePhotos';
import Step4AfterService from './Step4AfterService';
import Step5AfterServicePhotos from './Step5AfterServicePhotos';
import { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import MultiSteps from 'react-native-multi-steps';

type Props = {
  customerId: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setNewServiceId: React.Dispatch<React.SetStateAction<string | undefined>>;
};

const CreateService: React.FC<Props> = ({ customerId, visible, setVisible, setNewServiceId }) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [inputs, setInputs] = useState<Inputs>({
    date: {
      value: new Date(),
      isValid: true
    },
    hour: {
      value: '',
      isValid: true
    },
    minutes: {
      value: '',
      isValid: true
    },
    selectedServiceTypes: {
      value: [],
      isValid: true
    },
    beforeComments: {
      value: '',
      isValid: true
    },
    beforePhotos: {
      value: [],
      isValid: true
    },
    afterComments: {
      value: '',
      isValid: true
    },
    afterPhotos: {
      value: [],
      isValid: true
    }
  });
  const [touched, setTouched] = useState<Touched>({
    date: false,
    time: false,
    selectedServiceTypes: false,
    beforeComments: false,
    beforePhotos: false,
    afterComments: false,
    afterPhotos: false
  });
  const [errors, setErrors] = useState<ErrorType>({
    date: null,
    time: null,
    selectedServiceTypes: null,
    beforeComments: null,
    beforePhotos: null,
    afterComments: null,
    afterPhotos: null
  });

  const validateDate = (inputs: Inputs): boolean => {
    const newErrors = { ...errors };
    if (isValidDate(inputs.date.value)) {
      inputs.date.isValid = true;
      newErrors.date = null;
      setErrors(newErrors);
      return true;
    } else {
      inputs.date.isValid = false;
      newErrors.date = 'Data inválida';
      setErrors(newErrors);
      return false;
    }
  };

  const validateTime = (inputs: Inputs): boolean => {
    const newErrors = { ...errors };
    if (
      inputs.hour.value !== undefined &&
      inputs.hour.value !== '' &&
      inputs.minutes.value !== undefined &&
      inputs.minutes.value !== ''
    ) {
      inputs.hour.isValid = true;
      inputs.minutes.isValid = true;
      newErrors.time = null;
      setErrors(newErrors);
      console.log('No error');
      return true;
    } else {
      inputs.hour.isValid = false;
      inputs.minutes.isValid = false;
      newErrors.time = 'Horário inválido';
      console.log(newErrors.time);
      setErrors(newErrors);
      console.log(`Errors: ${JSON.stringify(errors)}`);
      return false;
    }
  };

  const validateServiceTypes = (inputs: Inputs): boolean => {
    const newErrors = { ...errors };
    if (inputs.selectedServiceTypes.value.length > 0) {
      inputs.selectedServiceTypes.isValid = true;
      newErrors.selectedServiceTypes = null;
      setErrors(newErrors);
      return true;
    } else {
      inputs.selectedServiceTypes.isValid = false;
      newErrors.selectedServiceTypes = 'Tipo do atendimento deve ser selecionado';
      setErrors(newErrors);
      return false;
    }
  };

  const handleChange = (
    field: string,
    enteredValue: string | Date | GetServiceTypeResponse[] | FileCustom[] | undefined
  ) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
    setInputs((curInputs) => {
      const newInputs = {
        ...curInputs,
        [field]: { value: enteredValue, isValid: true }
      };

      if (field === 'date') {
        newInputs[field].isValid = validateDate(newInputs);
      }

      if (field === 'hour' || field === 'minutes') {
        validateTime(newInputs);
      }

      if (field === 'selectedServiceTypes') {
        newInputs[field].isValid = validateServiceTypes(newInputs);
      }

      return newInputs;
    });
  };

  const handleBlur = (field: string) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
  };

  const validateForm = () => {
    const newInputs = { ...inputs };
    newInputs.date.isValid = validateDate(inputs);
    newInputs.minutes.isValid = validateTime(inputs);
    newInputs.hour.isValid = newInputs.minutes.isValid;
    newInputs.selectedServiceTypes.isValid = validateServiceTypes(inputs);
    setInputs(newInputs);
    return (
      newInputs.date.isValid &&
      newInputs.hour.isValid &&
      newInputs.minutes &&
      newInputs.selectedServiceTypes.isValid
    );
  };

  const submitHandler = async () => {
    if (!validateForm() || !authCtx.token?.access_token) return;

    setIsLoading(true);

    const dateObject = new Date(inputs.date.value);
    dateObject.setHours(inputs.hour.value as unknown as number);
    dateObject.setMinutes(inputs.minutes.value as unknown as number);

    const request = new CreateServiceRequest(
      dateObject,
      inputs.selectedServiceTypes.value,
      inputs.beforeComments.value,
      inputs.beforePhotos.value,
      inputs.afterComments.value,
      inputs.afterPhotos.value
    );

    const response = await createService(authCtx.token?.access_token, customerId, request);

    if (response.ok) {
      setNewServiceId(response.body.serviceId);
    } else {
      notificationCtx.showNotification({
        title: 'Ops...',
        message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
      });
    }
    setVisible(false);
    setIsLoading(false);
  };

  if (isLoading) {
    return <LoadingOverlay message={'Criando atendimento...'} />;
  }

  return (
    <>
      <StackSheetCustom visible={visible} setVisible={setVisible}>
        <View style={styles.container}>
          <MultiSteps
            containerButtonStyle={styles.containerButtonStyle}
            onMoveNext={function (data: any): void {
              console.log('next', data);
            }}
            onMovePrevious={function (data: any): void {
              console.log('previous', data);
            }}
            onSubmit={function () {
              submitHandler();
              console.log('Submit');
            }}
            config={{
              nextButtonLabel: 'Próximo',
              previousButtonLabel: 'Voltar',
              submitButtonLabel: 'Salvar'
            }}
          >
            <View>
              <Step1ServiceInfo
                inputs={inputs}
                touched={touched}
                errors={errors}
                changeHandler={handleChange}
                blurHandler={handleBlur}
              />
            </View>
            <View>
              <Step2BeforeService
                inputs={inputs}
                touched={touched}
                errors={errors}
                changeHandler={handleChange}
                blurHandler={handleBlur}
              />
            </View>
            <View>
              <Step3BeforeServicePhotos
                inputs={inputs}
                touched={touched}
                errors={errors}
                changeHandler={handleChange}
                blurHandler={handleBlur}
              />
            </View>
            <View>
              <Step4AfterService
                inputs={inputs}
                touched={touched}
                errors={errors}
                changeHandler={handleChange}
                blurHandler={handleBlur}
              />
            </View>
            <View>
              <Step5AfterServicePhotos
                inputs={inputs}
                touched={touched}
                errors={errors}
                changeHandler={handleChange}
                blurHandler={handleBlur}
              />
            </View>
          </MultiSteps>
        </View>
      </StackSheetCustom>
    </>
  );
};

export default CreateService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20
  },
  containerButtonStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 10,
    paddingRight: 30,
    width: '100%'
  }
});
