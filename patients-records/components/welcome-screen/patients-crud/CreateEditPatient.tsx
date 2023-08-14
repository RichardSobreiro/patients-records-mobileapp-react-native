/* eslint-disable import/order */
import { Colors } from '../../../constants/styles';
import { createNewPatient, GetCustomerById, updatePatient } from '../../../http/CustomersApi';
import { GetCustomer } from '../../../models/GetCustomersResponse';
import { AuthContext } from '../../../store/auth-context';
import Button, { ButtonTypes } from '../../ui/Button';
import LoadingOverlay from '../../ui/LoadingOverlay';
import DatePicker from '../../ui/custom-form/DatePicker';
import Input from '../../ui/custom-form/Input';
import Header from '../Header';
import ProceedingsList from './ProceedingsList';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditPatientStackParamList, RootStackParamList } from 'App';
import { CreatePatientResponse } from 'models/CreatePatientResponse';
import { UpdatePatientResponse } from 'models/UpdatePatientResponse';
import { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Alert, BackHandler } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type ErrorType = {
  customerName: null | string;
  email: null | string;
  phoneNumber: null | string;
  birthDate: null | string;
};

type Props = {
  navigation: HomeScreenNavigationProp;
  patientId?: string;
};

type HomeScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, 'Welcome'>,
  BottomTabScreenProps<EditPatientStackParamList>
>;

const CreateEditPatient: React.FC<Props> = ({ patientId }) => {
  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingMessage, setIsLoadingMessage] = useState<string | undefined>(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [isAtProceedingsList, setIsAtProceedingsList] = useState<boolean>(false);
  const [patient, setPatient] = useState<GetCustomer | undefined>(undefined);
  const [headerSubtitle, setHeaderSubtitle] = useState<string | undefined>('Informações Básicas');
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleCancel = useCallback(() => {
    navigation.navigate('Welcome', { shouldUpdatePatientsList: false });
  }, [navigation]);

  useEffect(() => {
    if (patientId) {
      setIsEditing(true);
      setIsLoading(true);
      const GetCustomer = async () => {
        const response = await GetCustomerById(patientId);
        if (response) {
          setPatient(() => {
            setInputs({
              customerName: {
                value: response.customerName,
                isValid: true
              },
              email: {
                value: response.email,
                isValid: true
              },
              birthDate: {
                value: new Date(response.birthDate),
                isValid: true
              },
              phoneNumber: {
                value: response.phoneNumber,
                isValid: true
              }
            });
            setIsLoading(false);
            return response;
          });
        } else {
          Alert.alert(
            'Erro',
            'Ocorreu um erro ao buscar as informações do paciente! Tente novamenete.'
          );
          setIsLoading(false);
          handleCancel();
        }
      };
      GetCustomer();
    }
  }, [handleCancel, patientId]);

  const handleBackFromProceedingsList = () => {
    setHeaderSubtitle('Informações Básicas');
    setIsAtProceedingsList(false);
  };

  useEffect(() => {
    const backAction = () => {
      if (isAtProceedingsList) {
        handleBackFromProceedingsList();
      } else {
        handleCancel();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, [handleCancel, isAtProceedingsList]);

  //----------------------------------------------------------------------------------------
  const [inputs, setInputs] = useState({
    customerName: {
      value: patient ? patient.customerName : '',
      isValid: true
    },
    email: {
      value: patient ? patient.email : '',
      isValid: true
    },
    birthDate: {
      value: patient ? new Date(patient.birthDate) : new Date(),
      isValid: true
    },
    phoneNumber: {
      value: patient ? patient.phoneNumber : '',
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
      setIsLoadingMessage('Salvando...');
      const createPatientRequest = {
        customerName: inputs.customerName.value,
        email: inputs.email.value,
        phoneNumber: inputs.phoneNumber.value,
        birthDate: inputs.birthDate.value
      };

      const callCreateUpdatePatientApi = async () => {
        let response: CreatePatientResponse | UpdatePatientResponse | undefined;
        if (isEditing) {
          // response = await updatePatient({
          //   userId: authCtx.userInfo?.email!,
          //   patientId: patientId!,
          //   customerName: createPatientRequest.customerName,
          //   phoneNumber: createPatientRequest.phoneNumber,
          //   email: createPatientRequest.email,
          //   birthDate: createPatientRequest.birthDate
          // });
        } else {
          // response = await createNewPatient({
          //   userId: authCtx.userInfo?.email!,
          //   customerName: createPatientRequest.customerName,
          //   phoneNumber: createPatientRequest.phoneNumber,
          //   email: createPatientRequest.email,
          //   birthDate: createPatientRequest.birthDate
          // });
        }
        setIsLoading(false);
        setIsLoadingMessage(undefined);
        // if (response?.patientId) {
        //   setIsEditing(true);
        //   setPatient(response);
        //   navigation.navigate('EditPatient', {
        //     patientId: response.patientId,
        //     patient: response,
        //     shouldUpdatePatientsList: true
        //   });
        //   Alert.alert(
        //     'Informações Salvas!',
        //     `Paciente ${isEditing ? 'atualizado' : 'criado'} com sucesso!`
        //   );
        // } else {
        //   Alert.alert(
        //     'Erro',
        //     'Ocorreu um erro ao salvar as informações do paciente! Tente novamente.'
        //   );
        // }
      };

      callCreateUpdatePatientApi();
    }
  };

  if (isLoading) {
    return <LoadingOverlay message={isLoadingMessage} />;
  }

  return (
    <>
      <View style={styles.header}>
        <Header
          isAddingPatientScreen={true}
          onSkipBackPressed={handleCancel}
          title={isEditing ? `${patient?.customerName!}` : 'Novo Paciente'}
          subtitle={headerSubtitle}
        />
      </View>
      {isEditing && isAtProceedingsList ? (
        <ProceedingsList patient={patient!} />
      ) : (
        <KeyboardAwareScrollView style={styles.content}>
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
              onPress={handleCancel}
              text={styles.buttonTextStyles}
              pressable={[styles.buttonPressable]}
              type={ButtonTypes.Cancel}
            >
              Cancelar
            </Button>
            <Button
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
      )}
    </>
  );
};

export default CreateEditPatient;

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
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  content: {
    backgroundColor: Colors.primary800,
    marginTop: 20,
    marginBottom: 15,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4
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
