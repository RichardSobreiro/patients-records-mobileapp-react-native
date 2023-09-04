/* eslint-disable import/order */
import DatePickerV2 from '../../../components/ui/custom-form/DatePickerV2';
import { Colors } from '../../../constants/styles';
import { createCustomer } from '../../../http/CustomersApi';
import { GetCustomer } from '../../../models/GetCustomersResponse';
import { CreateCustomerRequest } from '../../../models/customers/CreateCustomerRequest';
import { AuthContext } from '../../../store/auth-context';
import { NotificationContext } from '../../../store/notification-context';
import Button, { ButtonTypes } from '../../ui/Button';
import Input from '../../ui/custom-form/Input';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditPatientStackParamList, RootStackParamList } from 'App';
import { useContext, useState } from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type ErrorType = {
  customerName: null | string;
  email: null | string;
  phoneNumber: null | string;
  birthDate: null | string;
};

type Props = {
  navigation: HomeScreenNavigationProp;
};

type HomeScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, 'Welcome'>,
  BottomTabScreenProps<EditPatientStackParamList>
>;

const CreateCustomer: React.FC<Props> = () => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [customer, setCustomer] = useState<GetCustomer | undefined>(undefined);
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
    if (validateForm(inputs, true)) {
      setIsLoading(true);
      const createPatientRequest = {
        customerName: inputs.customerName.value,
        email: inputs.email.value,
        phoneNumber: inputs.phoneNumber.value,
        birthDate: inputs.birthDate.value
      };

      const callCreateUpdateCustomerApi = async () => {
        const request = new CreateCustomerRequest(
          createPatientRequest.customerName,
          createPatientRequest.phoneNumber,
          createPatientRequest.birthDate,
          createPatientRequest.email
        );

        const response = await createCustomer(authCtx.token?.access_token!, request);

        if (response.ok) {
          setCustomer(response.body);
          navigation.navigate('EditPatient', {
            customerId: response.body.customerId,
            shouldUpdatePatientsList: true
          });
          notificationCtx.showNotification({
            title: 'Paciente cadastrado',
            message: 'Agora você pode incluir atendimentos para seu novo paciente!'
          });
        } else {
          notificationCtx.showNotification({
            title: 'Ops...',
            message: 'Tivemos um problema passageiro. Por favor, tente novamente!'
          });
        }

        setIsLoading(false);
      };

      callCreateUpdateCustomerApi();
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
        <Input
          field="customerName"
          label="Nome:"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
        />
        <Input
          field="email"
          label="E-mail (Opcional):"
          keyboardType="email-address"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
        />
        <Input
          field="phoneNumber"
          label="Telefone:"
          keyboardType="phone-pad"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
        />
        <DatePickerV2
          field="birthDate"
          label="Data de Nascimento:"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          buttonStyle={{ marginVertical: 8 }}
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

export default CreateCustomer;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'column',
    marginTop: 15,
    alignItems: 'flex-end'
  },
  buttonPressable: {
    flex: 1,
    marginHorizontal: 3
  },
  buttonTextStyles: { fontSize: 20 },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  content: {
    marginTop: 20,
    marginBottom: 15,
    marginHorizontal: 32,
    padding: 16
  },
  button: {
    backgroundColor: '#2980b9',
    borderRadius: 15
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center'
  }
});
