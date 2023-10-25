/* eslint-disable import/order */
import AccordionItem from '../../../../../components/ui/AccordionItem';
import { Colors } from '../../../../../constants/styles';
import { getServiceById, updateService } from '../../../../../http/ServicesApi';
import { GetServiceTypeResponse } from '../../../../../models/customers/service-types/GetServiceTypesResponse';
import { GetServiceByIdResponse } from '../../../../../models/customers/services/GetServiceByIdResponse';
import { UpdateServiceRequest } from '../../../../../models/customers/services/UpdateServiceRequest';
import { AuthContext } from '../../../../../store/auth-context';
import { NotificationContext } from '../../../../../store/notification-context';
import { isValidDate } from '../../../../../util/date-helpers';
import FileCustom, { convertArrayPhotoApiToFileCustom } from '../../../../../util/types/FileCustom';
import { ErrorType, Inputs, Touched } from '../ServicesList';
import Step1ServiceInfo from './Setp1ServicesInfo';
import Step2BeforeService from './Step2BeforeService';
import Step3BeforeServicePhotos from './Step3BeforeServicePhotos';
import Step4AfterService from './Step4AfterService';
import Step5AfterServicePhotos from './Step5AfterServicePhotos';

import { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Snackbar } from 'react-native-paper';

type Props = {
  customerId: string;
  serviceId: string;
  route: any;
  navigation: any;
  showCreatedSnackbar?: boolean;
};

const EditService: React.FC<Props> = ({
  customerId,
  serviceId,
  route,
  navigation,
  showCreatedSnackbar
}) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);

  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [visibleCreatedSnackbar, setVisibleCreatedSnackbar] = useState<boolean>(
    !!showCreatedSnackbar
  );

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
    durationHours: {
      value: 0,
      isValid: true
    },
    durationMinutes: {
      value: 30,
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
      durationHours: {
        value: 0,
        isValid: true
      },
      durationMinutes: {
        value: 30,
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

  const setServiceState = async (getServiceResponse: GetServiceByIdResponse) => {
    const dateObject = new Date(getServiceResponse.date);
    const beforePhotosFileCustom = await convertArrayPhotoApiToFileCustom(
      getServiceResponse.beforePhotos,
      'before-photo'
    );

    const afterPhotosFileCustom = await convertArrayPhotoApiToFileCustom(
      getServiceResponse.afterPhotos,
      'after-photo'
    );
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
      durationHours: {
        value: getServiceResponse.durationHours,
        isValid: true
      },
      durationMinutes: {
        value: getServiceResponse.durationMinutes,
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
  };

  useEffect(() => {
    if (serviceId && authCtx.token?.access_token) {
      const getServiceAsync = async () => {
        setIsLoading(true);
        const response = await getServiceById(authCtx.token?.access_token!, customerId, serviceId);
        if (response.ok) {
          const getServiceResponse = response.body as GetServiceByIdResponse;
          await setServiceState(getServiceResponse);
        }

        setIsLoading(false);
      };

      getServiceAsync();
    }
  }, [authCtx.token?.access_token, customerId, serviceId]);

  const validateDate = useCallback(
    (inputs: Inputs): boolean => {
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
    },
    [errors]
  );

  const validateTime = useCallback(
    (inputs: Inputs): boolean => {
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
        setErrors(newErrors);
        return false;
      }
    },
    [errors]
  );

  const validateServiceTypes = useCallback(
    (inputs: Inputs): boolean => {
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
    },
    [errors]
  );

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

  const validateForm = useCallback(() => {
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
  }, [inputs, validateDate, validateServiceTypes, validateTime]);

  const submitHandler = useCallback(async () => {
    if (!validateForm() || !authCtx.token?.access_token || !serviceId) return;

    setIsLoading(true);

    const dateObject = new Date(inputs.date.value);
    dateObject.setHours(inputs.hour.value as unknown as number);
    dateObject.setMinutes(inputs.minutes.value as unknown as number);

    const request = new UpdateServiceRequest(
      serviceId,
      dateObject,
      inputs.durationHours.value,
      inputs.durationMinutes.value,
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
      const getServiceResponse = response.body as GetServiceByIdResponse;
      await setServiceState(getServiceResponse);
      setVisibleSnackbar(true);
      setTimeout(() => {
        setVisibleSnackbar(false);
      }, 5000);
    } else {
      resetInputs();
      notificationCtx.showNotification({
        title: 'Ops...',
        message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
      });
    }
    setIsLoading(false);
  }, [
    authCtx.token?.access_token,
    customerId,
    inputs.afterComments.value,
    inputs.afterPhotos.value,
    inputs.beforeComments.value,
    inputs.beforePhotos.value,
    inputs.date.value,
    inputs.durationHours.value,
    inputs.durationMinutes.value,
    inputs.hour.value,
    inputs.minutes.value,
    inputs.selectedServiceTypes.value,
    notificationCtx,
    serviceId,
    validateForm
  ]);

  useLayoutEffect(() => {
    if (!navigation || navigation === undefined || !route || route === undefined) return;

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            submitHandler();
          }}
          style={{
            borderColor: Colors.secondary500,
            borderWidth: 1,
            borderRadius: 20,
            paddingVertical: 5,
            paddingHorizontal: 10
          }}
        >
          <Text style={{ color: Colors.secondary500 }}>Salvar</Text>
        </TouchableOpacity>
      )
    });

    const patientsBottomTabNavigator = navigation.getParent('PatientsBottomTab');
    if (patientsBottomTabNavigator) {
      if (route.name === 'EditService') {
        patientsBottomTabNavigator.setOptions({
          tabBarStyle: { display: 'none' }
        });
      }
    }

    const tabNavigator = navigation.getParent('PatientsHomeScreenStack');
    if (tabNavigator) {
      if (route.name === 'EditService') {
        tabNavigator.setOptions({
          headerShown: false
        });
      }
    }

    const mainDrawerNavigator = navigation.getParent('MainDrawerNavigator');
    if (mainDrawerNavigator) {
      if (route.name === 'EditService') {
        mainDrawerNavigator.setOptions({
          headerShown: false
        });
      }
    }

    return () => {
      tabNavigator?.setOptions({
        headerShown: true
      });
      patientsBottomTabNavigator?.setOptions({
        tabBarStyle: { display: 'absolute' }
      });
      mainDrawerNavigator?.setOptions({
        headerShown: true
      });
    };
  }, [navigation, route, submitHandler]);

  useEffect(() => {
    if (visibleCreatedSnackbar) {
      setTimeout(() => {
        setVisibleCreatedSnackbar(false);
      }, 5000);
    }
  }, [visibleCreatedSnackbar]);

  return (
    <>
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
      <KeyboardAwareScrollView
        enableOnAndroid={true}
        style={styles.container}
        overScrollMode="never"
        extraScrollHeight={200}
        extraHeight={200}
      >
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
          navigation={navigation}
        />

        <AccordionItem title={'Antes do procedimento'} initiallyExpanded={false}>
          <Step3BeforeServicePhotos
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
        </AccordionItem>

        <AccordionItem title={'Depois do procedimento'} initiallyExpanded={false}>
          <Step5AfterServicePhotos
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
        </AccordionItem>
      </KeyboardAwareScrollView>
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
