import Input from '../../../../../components/ui/custom-form/Input';
import { Colors } from '../../../../../constants/styles';
import { createServiceType } from '../../../../../http/ServiceTypesApi';
import { CreateServiceTypeRequest } from '../../../../../models/customers/service-types/CreateServiceTypeRequest';
import { CreateServiceTypeResponse } from '../../../../../models/customers/service-types/CreateServiceTypeResponse';
import { AuthContext } from '../../../../../store/auth-context';
import { NotificationContext } from '../../../../../store/notification-context';
import { AntDesign } from '@expo/vector-icons';
import { useCallback, useContext, useLayoutEffect, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Text
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type ErrorTypeNewService = {
  serviceTypeDescription: null | string;
  serviceTypeTemplate: null | string;
};

type Props = {
  route: any;
  navigation: any;
};

const CreateServiceType: React.FC<Props> = ({ route, navigation }) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);
  const [isLoading, setIsLoading] = useState(false);

  const [inputs, setInputs] = useState({
    serviceTypeDescription: {
      value: '',
      isValid: true
    }
  });

  const [touched, setTouched] = useState({
    serviceTypeDescription: false,
    serviceTypeTemplate: false
  });

  const [errorsNewService, setErrors] = useState<ErrorTypeNewService>({
    serviceTypeDescription: null,
    serviceTypeTemplate: null
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

    const createServiceTypeRequest = new CreateServiceTypeRequest(
      inputs.serviceTypeDescription.value!
    );

    const apiResponse = await createServiceType(
      authCtx.token?.access_token!,
      createServiceTypeRequest
    );

    if (apiResponse.ok) {
      const createServiceTypeResponse = apiResponse.body as CreateServiceTypeResponse;
      navigation.replace('EditServiceType', {
        serviceTypeId: createServiceTypeResponse.serviceTypeId,
        showCreatedSnackbar: true
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
    inputs.serviceTypeDescription.isValid,
    inputs.serviceTypeDescription.value,
    navigation,
    notificationCtx
  ]);

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

    const tabNavigator = navigation.getParent('RootStack');
    if (tabNavigator) {
      if (route.name === 'CreateServiceType') {
        tabNavigator.setOptions({
          headerShown: false
        });
      }
    }

    return () => {
      tabNavigator.setOptions({
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

export default CreateServiceType;
