/* eslint-disable import/order */
import { Colors } from '../../../../../constants/styles';
import { getServiceById, updateService } from '../../../../../http/ServicesApi';
import { GetServiceTypeResponse } from '../../../../../models/customers/service-types/GetServiceTypesResponse';
import { GetServiceByIdResponse } from '../../../../../models/customers/services/GetServiceByIdResponse';
import { UpdateServiceRequest } from '../../../../../models/customers/services/UpdateServiceRequest';
import { AuthContext } from '../../../../../store/auth-context';
import { NotificationContext } from '../../../../../store/notification-context';
import { isValidDate } from '../../../../../util/date-helpers';
import FileCustom, { convertArrayPhotoApiToFileCustom } from '../../../../../util/types/FileCustom';
import StackSheetCustom from '../../../../ui/custom-form/StackSheetCustom';
import { ErrorType, Inputs, Touched } from '../../ServicesList';
import Step1ServiceInfo from './Setp1ServicesInfo';
import Step2BeforeService from './Step2BeforeService';
import Step3BeforeServicePhotos from './Step3BeforeServicePhotos';
import Step4AfterService from './Step4AfterService';
import Step5AfterServicePhotos from './Step5AfterServicePhotos';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { Snackbar } from 'react-native-paper';

type Props = {
  customerId: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  serviceId: string | undefined;
  setServiceId: React.Dispatch<React.SetStateAction<string | undefined>>;
  showCreatedServiceSnackbar: boolean;
};

const EditService: React.FC<Props> = ({
  customerId,
  visible,
  setVisible,
  serviceId,
  setServiceId,
  showCreatedServiceSnackbar
}) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [visibleCreatedSnackbar, setVisibleCreatedSnackbar] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [inputs, setInputs] = useState<Inputs>({
    date: {
      value: new Date(),
      isValid: true
    },
    hour: {
      value: 9,
      isValid: true
    },
    minutes: {
      value: 0,
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

  const resetInputs = () => {
    setInputs({
      date: {
        value: new Date(),
        isValid: true
      },
      hour: {
        value: 9,
        isValid: true
      },
      minutes: {
        value: 0,
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
    setTouched({
      date: false,
      time: false,
      selectedServiceTypes: false,
      beforeComments: false,
      beforePhotos: false,
      afterComments: false,
      afterPhotos: false
    });
    setErrors({
      date: null,
      time: null,
      selectedServiceTypes: null,
      beforeComments: null,
      beforePhotos: null,
      afterComments: null,
      afterPhotos: null
    });
  };

  useEffect(() => {
    if (showCreatedServiceSnackbar) {
      setVisibleCreatedSnackbar(true);
      setTimeout(() => {
        setVisibleCreatedSnackbar(false);
      }, 5000);
    }
  }, [showCreatedServiceSnackbar]);

  useEffect(() => {
    if (serviceId && authCtx.token?.access_token) {
      setIsLoading(true);

      const getServiceAsync = async () => {
        const response = await getServiceById(authCtx.token?.access_token!, customerId, serviceId);
        const getServiceResponse = response.body as GetServiceByIdResponse;
        const dateObject = new Date(getServiceResponse.date);
        const beforePhotosFileCustom = await convertArrayPhotoApiToFileCustom(
          getServiceResponse.beforePhotos,
          'before-photo'
        );
        const afterPhotosFileCustom = await convertArrayPhotoApiToFileCustom(
          getServiceResponse.afterPhotos,
          'after-photo'
        );
        if (response.ok) {
          setInputs({
            date: {
              value: dateObject,
              isValid: true
            },
            hour: {
              value: dateObject.getHours(),
              isValid: true
            },
            minutes: {
              value: dateObject.getMinutes(),
              isValid: true
            },
            selectedServiceTypes: {
              value: [...getServiceResponse.serviceTypes],
              isValid: true
            },
            beforeComments: {
              value: getServiceResponse.beforeNotes,
              isValid: true
            },
            beforePhotos: {
              value: beforePhotosFileCustom,
              isValid: true
            },
            afterComments: {
              value: getServiceResponse.afterNotes,
              isValid: true
            },
            afterPhotos: {
              value: afterPhotosFileCustom,
              isValid: true
            }
          });
        }
      };

      getServiceAsync();

      setIsLoading(false);
    }
  }, [authCtx.token?.access_token, customerId, serviceId]);

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
    if (inputs.hour.value !== undefined && inputs.minutes.value !== undefined) {
      inputs.hour.isValid = true;
      inputs.minutes.isValid = true;
      newErrors.time = null;
      setErrors(newErrors);
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
        console.log('FIELD date');
        newInputs[field].isValid = validateDate(newInputs);
      }

      if (field === 'hour' || field === 'minutes') {
        console.log(`FIELD hour:minutes: ${newInputs.hour.value}:${newInputs.minutes.value}`);
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
    if (!validateForm() || !authCtx.token?.access_token || !serviceId) return;

    setIsLoading(true);

    const dateObject = new Date(inputs.date.value);
    dateObject.setHours(inputs.hour.value as unknown as number);
    dateObject.setMinutes(inputs.minutes.value as unknown as number);

    const request = new UpdateServiceRequest(
      serviceId,
      dateObject,
      inputs.selectedServiceTypes.value,
      inputs.beforeComments.value,
      inputs.beforePhotos.value,
      inputs.afterComments.value,
      inputs.afterPhotos.value
    );

    const response = await updateService(
      authCtx.token?.access_token,
      customerId,
      serviceId,
      request
    );

    if (response.ok) {
      setServiceId(response.body.serviceId);
      setVisibleSnackbar(true);
      setTimeout(() => {
        setVisibleSnackbar(false);
      }, 5000);
    } else {
      setVisible(false);
      setServiceId(undefined);
      resetInputs();
      notificationCtx.showNotification({
        title: 'Ops...',
        message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
      });
    }
    setIsLoading(false);
  };

  return (
    <>
      <StackSheetCustom
        visible={visible}
        setVisible={setVisible}
        hideModalCallback={() => {
          setVisible(false);
          setServiceId(undefined);
          resetInputs();
        }}
        saveModalCallback={submitHandler}
      >
        {isLoading && (
          <ActivityIndicator
            color={Colors.primary800}
            size={120}
            style={{
              flex: 1,
              position: 'absolute',
              left: 0,
              right: 0,
              top: 0,
              bottom: 0,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: Colors.tertiary900Op12,
              zIndex: 2000
            }}
          />
        )}
        <ScrollView style={styles.container} overScrollMode="never">
          <Snackbar
            visible={visibleSnackbar}
            onDismiss={() => {}}
            wrapperStyle={{ zIndex: 7000, top: 0 }}
            style={{
              backgroundColor: Colors.secondary500
            }}
          >
            Alterações salvas com sucesso!
          </Snackbar>
          <Snackbar
            visible={visibleCreatedSnackbar}
            onDismiss={() => {}}
            wrapperStyle={{ zIndex: 7000, top: 0 }}
            style={{
              backgroundColor: Colors.secondary500
            }}
          >
            Atendimento criado com sucesso!
          </Snackbar>
          <Step1ServiceInfo
            inputs={inputs}
            touched={touched}
            errors={errors}
            changeHandler={handleChange}
            blurHandler={handleBlur}
          />
          <Step2BeforeService
            inputs={inputs}
            touched={touched}
            errors={errors}
            changeHandler={handleChange}
            blurHandler={handleBlur}
          />
          <Step3BeforeServicePhotos
            inputs={inputs}
            touched={touched}
            errors={errors}
            changeHandler={handleChange}
            blurHandler={handleBlur}
          />
          <Step4AfterService
            inputs={inputs}
            touched={touched}
            errors={errors}
            changeHandler={handleChange}
            blurHandler={handleBlur}
          />
          <Step5AfterServicePhotos
            inputs={inputs}
            touched={touched}
            errors={errors}
            changeHandler={handleChange}
            blurHandler={handleBlur}
          />
        </ScrollView>
      </StackSheetCustom>
    </>
  );
};

export default EditService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20
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
