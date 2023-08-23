/* eslint-disable import/order */
import { Colors } from '../../../constants/styles';
import { getCustomerById, updateCustomer } from '../../../http/CustomersApi';
import { GetCustomer } from '../../../models/GetCustomersResponse';
import { UpdateCustomerRequest } from '../../../models/customers/UpdateCustomerRequest';
import { AuthContext } from '../../../store/auth-context';
import { NotificationContext } from '../../../store/notification-context';
import Button, { ButtonTypes } from '../../ui/Button';
import DatePicker from '../../ui/custom-form/DatePicker';
import Input from '../../ui/custom-form/Input';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditPatientStackParamList, RootStackParamList } from 'App';
import { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, BackHandler, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Snackbar } from 'react-native-paper';

type ErrorType = {
  customerName: null | string;
  email: null | string;
  phoneNumber: null | string;
  birthDate: null | string;
};

type Props = {
  navigation: HomeScreenNavigationProp;
  customerId: string;
};

type HomeScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, 'Welcome'>,
  BottomTabScreenProps<EditPatientStackParamList>
>;

const EditCustomer: React.FC<Props> = ({ customerId }) => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);

  const [isAtServicesList, setIsAtServicesList] = useState<boolean>(false);
  const [customer, setCustomer] = useState<GetCustomer | undefined>(undefined);
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleCancel = useCallback(() => {
    navigation.navigate('Welcome', { shouldUpdatePatientsList: false });
  }, [navigation]);

  useEffect(() => {
    console.log(customerId);
    if (customerId) {
      setIsLoading(true);
      const getCustomerByIdAsync = async () => {
        if (authCtx.token?.access_token) {
          try {
            const response = await getCustomerById(authCtx.token?.access_token, customerId);
            if (response.ok) {
              setCustomer(() => {
                setInputs({
                  customerName: {
                    value: response.body.customerName,
                    isValid: true
                  },
                  email: {
                    value: response.body.email,
                    isValid: true
                  },
                  birthDate: {
                    value: new Date(response.body.birthDate),
                    isValid: true
                  },
                  phoneNumber: {
                    value: response.body.phoneNumber,
                    isValid: true
                  }
                });
                setIsLoading(false);
                return response.body;
              });
            } else {
              notificationCtx.showNotification({
                title: 'Ops...',
                message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
              });
              setIsLoading(false);
              handleCancel();
            }
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error: any) {
            notificationCtx.showNotification({
              title: 'Ops...',
              message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
            });
            setIsLoading(false);
            handleCancel();
          }
        }
      };
      getCustomerByIdAsync();
    }
  }, [handleCancel, customerId, notificationCtx, authCtx.token?.access_token]);

  const handleBackFromServicesList = () => {
    setIsAtServicesList(false);
  };

  useEffect(() => {
    const backAction = () => {
      if (isAtServicesList) {
        handleBackFromServicesList();
      } else {
        handleCancel();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [handleCancel, isAtServicesList]);

  //----------------------------------------------------------------------------------------
  const [inputs, setInputs] = useState({
    customerName: {
      value: customer ? customer.customerName : '',
      isValid: true
    },
    email: {
      value: customer ? customer.email : '',
      isValid: true
    },
    birthDate: {
      value: customer ? new Date(customer.birthDate) : new Date(),
      isValid: true
    },
    phoneNumber: {
      value: customer ? customer.phoneNumber : '',
      isValid: true
    }
  });

  const [touched, setTouched] = useState({
    customerName: false,
    email: false,
    phoneNumber: false,
    birthDate: false
  });

  const [errors, setErrors] = useState<ErrorType>({
    customerName: null,
    email: null,
    phoneNumber: null,
    birthDate: null
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
      validateForm(newInputs, false);
      return newInputs;
    });
  };

  const handleBlur = (field: string) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
  };

  const validateForm = (createPatientRequest: any, validateAll?: boolean): boolean => {
    let customerNameIsValid = true;
    let phoneNumberIsValid = true;
    let birthDateIsValid = true;

    if (validateAll || touched['customerName']) {
      customerNameIsValid = createPatientRequest.customerName.value.trim().length > 0;
    }
    const emailIsValid = true;
    if (validateAll || touched['phoneNumber']) {
      phoneNumberIsValid = createPatientRequest.phoneNumber.value.trim().length > 0;
    }
    if (validateAll || touched['birthDate']) {
      birthDateIsValid = createPatientRequest.birthDate.value?.toString() !== 'Invalid Date';
    }

    setErrors((curErrors) => {
      if (!customerNameIsValid) {
        curErrors['customerName'] = 'O nome do paciente é inválido';
        setIsFormValid(false);
      } else {
        curErrors['customerName'] = null;
      }
      if (!emailIsValid) {
        curErrors['email'] = 'O email do paciente é inválido';
        setIsFormValid(false);
      } else {
        curErrors['email'] = null;
      }
      if (!phoneNumberIsValid) {
        curErrors['phoneNumber'] = 'O número de contato do paciente é inválido';
        setIsFormValid(false);
      } else {
        curErrors['phoneNumber'] = null;
      }
      if (!birthDateIsValid) {
        curErrors['birthDate'] = 'A data de nascimento do paciente é inválida';
        setIsFormValid(false);
      } else {
        curErrors['birthDate'] = null;
      }
      return curErrors;
    });

    if (customerNameIsValid && emailIsValid && phoneNumberIsValid && birthDateIsValid) {
      setIsFormValid(true);
      return true;
    } else {
      setIsFormValid(false);
      return false;
    }
  };

  const submitHandler = () => {
    if (validateForm(inputs, true) && authCtx.token?.access_token) {
      setIsLoading(true);
      const callUpdateCustomerApi = async () => {
        const request = new UpdateCustomerRequest(
          customerId,
          inputs.customerName.value,
          inputs.phoneNumber.value,
          inputs.birthDate.value,
          inputs.email.value
        );

        const response = await updateCustomer(authCtx.token?.access_token!, request);

        if (response.ok) {
          setVisibleSnackbar(true);
          setTimeout(() => {
            setVisibleSnackbar(false);
          }, 5000);
        } else {
          notificationCtx.showNotification({
            title: 'Ops...',
            message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
          });
        }

        setIsLoading(false);
      };

      callUpdateCustomerApi();
    }
  };

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
      <KeyboardAwareScrollView style={styles.content}>
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
        <Input
          field="customerName"
          label="Nome"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
        />
        <Input
          field="email"
          label="E-mail (Opcional)"
          keyboardType="email-address"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
        />
        <Input
          field="phoneNumber"
          label="Número de Telefone"
          keyboardType="phone-pad"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
        />
        <DatePicker
          field="birthDate"
          label="Data de Nascimento"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
        />
        <View style={styles.buttons}>
          <Button
            type={ButtonTypes.Primary_Bordered}
            onPress={submitHandler}
            text={styles.buttonTextStyles}
            pressable={[
              {
                opacity: isFormValid ? 1 : 0.5
              },
              styles.buttonPressable
            ]}
          >
            Salvar
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default EditCustomer;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    marginTop: 5
  },
  buttonPressable: {
    flex: 1,
    marginHorizontal: 3
  },
  buttonTextStyles: { fontSize: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  content: {
    marginTop: 20,
    marginBottom: 15,
    marginHorizontal: 32,
    padding: 16,
    backgroundColor: Colors.primary100
  },
  button: {
    borderRadius: 15
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center'
  }
});
