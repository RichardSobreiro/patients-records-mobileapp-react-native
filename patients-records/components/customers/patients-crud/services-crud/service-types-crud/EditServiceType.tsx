import { Colors } from '../../../../../constants/styles';
import { getServiceTypesById, updateServiceType } from '../../../../../http/ServiceTypesApi';
import { UpdateServiceTypeRequest } from '../../../../../models/customers/service-types/UpdateServiceTypeRequest';
import { AuthContext } from '../../../../../store/auth-context';
import { NotificationContext } from '../../../../../store/notification-context';
import Input from '../../../../ui/custom-form/Input';
import { GetServiceTypeResponse } from '/models/customers/service-types/GetServiceTypesResponse';

import { AntDesign } from '@expo/vector-icons';
import { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity
} from 'react-native';
import { Snackbar } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';

type ErrorType = {
  serviceTypeDescription: null | string;
};

type Props = {
  serviceTypeId: string;
  route: any;
  navigation: any;
  showCreatedSnackbar?: boolean;
};

const EditServiceType: React.FC<Props> = ({
  serviceTypeId,
  route,
  navigation,
  showCreatedSnackbar
}) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);
  const [isLoading, setIsLoading] = useState(false);

  const [visibleUpdatedSnackbar, setVisibleUpdatedSnackbar] = useState<boolean>(false);
  const [visibleCreatedSnackbar, setVisibleCreatedSnackbar] = useState<boolean>(
    !!showCreatedSnackbar
  );

  const [inputs, setInputs] = useState({
    serviceTypeDescription: {
      value: '',
      isValid: true
    }
  });

  const [touched, setTouched] = useState({
    serviceTypeDescription: false
  });

  const [errorsNewService, setErrors] = useState<ErrorType>({
    serviceTypeDescription: null
  });

  const handleChange = (field: string, enteredValue: any) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
    setInputs((curInputs) => {
      const newInputs = {
        ...curInputs,
        [field]: { value: enteredValue, isValid: true }
      };
      setErrors((curErrors) => {
        if (
          newInputs.serviceTypeDescription.value &&
          newInputs.serviceTypeDescription.value !== ''
        ) {
          newInputs.serviceTypeDescription.isValid = true;
          curErrors.serviceTypeDescription = null;
        } else {
          newInputs.serviceTypeDescription.isValid = false;
          curErrors.serviceTypeDescription = 'O nome do tipo de atendimento deve ser preenchido';
        }
        return curErrors;
      });
      return newInputs;
    });
  };

  const handleBlur = (field: string) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
  };

  const saveAsync = useCallback(async () => {
    if (!inputs.serviceTypeDescription.isValid) {
      return;
    }

    setIsLoading(true);

    const updateServiceTypeRequest = new UpdateServiceTypeRequest(
      serviceTypeId,
      inputs.serviceTypeDescription.value!,
      null
    );

    const apiResponse = await updateServiceType(
      authCtx.token?.access_token!,
      updateServiceTypeRequest
    );

    if (apiResponse.ok) {
      setVisibleUpdatedSnackbar(true);
      setTimeout(() => {
        setVisibleUpdatedSnackbar(false);
      }, 5000);
    } else {
      notificationCtx.showNotification({
        title: 'Ops...',
        message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
      });
    }

    setIsLoading(false);
  }, [
    authCtx.token?.access_token,
    inputs.serviceTypeDescription.isValid,
    inputs.serviceTypeDescription.value,
    notificationCtx,
    serviceTypeId
  ]);

  useEffect(() => {
    if (visibleCreatedSnackbar) {
      setTimeout(() => {
        setVisibleCreatedSnackbar(false);
      }, 5000);
    }
  }, [visibleCreatedSnackbar]);

  useEffect(() => {
    const getServiceTypeAsync = async () => {
      setIsLoading(true);

      const response = await getServiceTypesById(authCtx.token?.access_token!, serviceTypeId);

      if (response.ok) {
        const serviceTypeResponse = response.body as GetServiceTypeResponse;
        setInputs({
          serviceTypeDescription: {
            value: serviceTypeResponse.serviceTypeDescription,
            isValid: true
          }
        });
        setTouched({
          serviceTypeDescription: false
        });
        setErrors({
          serviceTypeDescription: null
        });
      } else {
        notificationCtx.showNotification({
          title: 'Ops...',
          message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
        });
      }
      setIsLoading(false);
    };
    getServiceTypeAsync();
  }, [authCtx.token?.access_token, notificationCtx, serviceTypeId]);

  useLayoutEffect(() => {
    if (!navigation || !route) return;

    navigation.setOptions({
      headerLeft: () => (
        <TouchableOpacity>
          <AntDesign
            style={{ paddingLeft: 0, paddingRight: 30 }}
            name="arrowleft"
            size={24}
            color={Colors.primary500}
            onPress={() => {
              navigation.setOptions({
                headerShown: false
              });
              navigation.goBack();
            }}
          />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <TouchableOpacity
          onPress={() => {
            saveAsync();
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

    const tabNavigator = navigation.getParent('PatientsHomeScreenStack');
    if (tabNavigator) {
      if (route.name === 'EditServiceType') {
        tabNavigator.setOptions({
          headerShown: false
        });
      }
    }

    return () => {
      tabNavigator?.setOptions({
        headerShown: false
      });
    };
  }, [navigation, route, saveAsync]);

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
      <SafeAreaView style={{ flex: 1, width: '100%' }}>
        <Snackbar
          visible={visibleUpdatedSnackbar}
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
          Tipo de procedimento criado com sucesso!
        </Snackbar>
        <ScrollView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, marginHorizontal: 8, marginVertical: 8 }}
          >
            <Input
              field="serviceTypeDescription"
              label="Nome"
              values={inputs}
              touched={touched}
              errors={errorsNewService}
              onChangeHandler={handleChange}
              onBlurHandler={handleBlur}
            />
          </KeyboardAvoidingView>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

export default EditServiceType;
