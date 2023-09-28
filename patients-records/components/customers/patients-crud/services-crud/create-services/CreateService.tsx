/* eslint-disable import/order */
import AccordionItem from '../../../../../components/ui/AccordionItem';
import { Colors } from '../../../../../constants/styles';
import { createService } from '../../../../../http/ServicesApi';
import { GetServiceTypeResponse } from '../../../../../models/customers/service-types/GetServiceTypesResponse';
import { CreateServiceRequest } from '../../../../../models/customers/services/CreateServiceRequest';
import { AuthContext } from '../../../../../store/auth-context';
import { NotificationContext } from '../../../../../store/notification-context';
import { isValidDate } from '../../../../../util/date-helpers';
import FileCustom from '../../../../../util/types/FileCustom';
import { ErrorType, Inputs, Touched } from '../ServicesList';
import Step1ServiceInfo from './Setp1ServicesInfo';
import Step2BeforeService from './Step2BeforeService';
import Step3BeforeServicePhotos from './Step3BeforeServicePhotos';
import Step4AfterService from './Step4AfterService';
import Step5AfterServicePhotos from './Step5AfterServicePhotos';
import { useCallback, useContext, useLayoutEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Props = {
  customerId: string;
  route: any;
  navigation: any;
};

const CreateService: React.FC<Props> = ({ customerId, route, navigation }) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);

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
    if (!validateForm() || !authCtx.token?.access_token) return;

    setIsLoading(true);

    const dateObject = new Date(inputs.date.value);

    const request = new CreateServiceRequest(
      new Date(
        dateObject.getFullYear(),
        dateObject.getMonth(),
        dateObject.getDate(),
        inputs.hour.value! * 1,
        inputs.minutes.value * 1
      ),
      inputs.selectedServiceTypes.value,
      inputs.beforeComments.value,
      inputs.beforePhotos.value,
      inputs.afterComments.value,
      inputs.afterPhotos.value
    );

    const response = await createService(authCtx.token?.access_token, customerId, request);

    if (response.ok) {
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
      setErrors({
        date: null,
        time: null,
        selectedServiceTypes: null,
        beforeComments: null,
        beforePhotos: null,
        afterComments: null,
        afterPhotos: null
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
    } else {
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
    inputs.hour.value,
    inputs.minutes.value,
    inputs.selectedServiceTypes.value,
    notificationCtx,
    validateForm
  ]);

  useLayoutEffect(() => {
    if (!navigation || !route) return;

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
      if (route.name === 'CreateService') {
        patientsBottomTabNavigator.setOptions({
          tabBarStyle: { display: 'none' }
        });
      }
    }

    const tabNavigator = navigation.getParent('RootStack');
    if (tabNavigator) {
      if (route.name === 'CreateService') {
        tabNavigator.setOptions({
          headerShown: false
        });
      }
    }

    return () => {
      tabNavigator.setOptions({
        headerShown: true
      });
      patientsBottomTabNavigator.setOptions({
        tabBarStyle: { display: 'absolute' }
      });
    };
  }, [navigation, route, submitHandler]);

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
        // extraScrollHeight={200}
        // extraHeight={200}
      >
        <Step1ServiceInfo
          inputs={inputs}
          touched={touched}
          errors={errors}
          changeHandler={handleChange}
          blurHandler={handleBlur}
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

export default CreateService;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
    paddingHorizontal: 20
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
