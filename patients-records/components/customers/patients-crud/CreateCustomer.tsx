/* eslint-disable import/order */
import AccordionItem from '../../../components/ui/AccordionItem';
import DatePickerV2 from '../../../components/ui/custom-form/DatePickerV2';
import Dropdown from '../../../components/ui/Dropdown';
import DropdownModal from '../../../components/ui/DropdownModal';
import { Colors } from '../../../constants/styles';
import { createCustomer } from '../../../http/CustomersApi';
import { getCepInfo } from '../../../http/PostalService';
import { CreateCustomerRequest } from '../../../models/customers/CreateCustomerRequest';
import { PostalServiceResponse } from '../../../models/postal-service/PostalServiceResponse';
import { EditPatientStackParamList } from '../../../screens/navigators/EditPatientsBottomTabsNavigator';
import { RootStackParamList } from '../../../screens/Patients/PatientsHomeScreen';
import { AuthContext } from '../../../store/auth-context';
import { NotificationContext } from '../../../store/notification-context';
import { maskCEP, maskCPF } from '../../../util/mask-functions';
import Button, { ButtonTypes } from '../../ui/Button';
import Input from '../../ui/custom-form/Input';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type ErrorType = {
  customerName: null | string;
  birthDate: null | string;
  cpf: null | string;
  gender: null | string;
  maritalStatus: null | string;
  ethnicity: null | string;
  placeOfBirth: null | string;
  occupation: null | string;
  phoneNumber: null | string;
  email: null | string;
  instagramAccount: null | string;
  cep: null | string;
  street: null | string;
  number: null | string;
  district: null | string;
  city: null | string;
  complement: null | string;
  state: null | string;
};

type Props = {
  navigation: HomeScreenNavigationProp;
};

type HomeScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, 'PatientsList'>,
  BottomTabScreenProps<EditPatientStackParamList>
>;

const CreateCustomer: React.FC<Props> = () => {
  const authCtx = useContext(AuthContext);
  const notificationCtx = useContext(NotificationContext);

  const scrollViewRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFormValid, setIsFormValid] = useState<boolean>(true);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [statesModalVisible, setStatesModalVisible] = useState<boolean>(false);

  const [inputs, setInputs] = useState({
    customerName: {
      value: '',
      isValid: true
    },
    birthDate: {
      value: new Date(),
      isValid: true
    },
    cpf: {
      value: '',
      isValid: true
    },
    gender: {
      value: '',
      isValid: true
    },
    maritalStatus: {
      value: '',
      isValid: true
    },
    ethnicity: {
      value: '',
      isValid: true
    },
    placeOfBirth: {
      value: '',
      isValid: true
    },
    occupation: {
      value: '',
      isValid: true
    },
    phoneNumber: {
      value: '',
      isValid: true
    },
    email: {
      value: '',
      isValid: true
    },
    instagramAccount: {
      value: '',
      isValid: true
    },
    cep: {
      value: '',
      isValid: true
    },
    street: {
      value: '',
      isValid: true
    },
    number: {
      value: '',
      isValid: true
    },
    district: {
      value: '',
      isValid: true
    },
    city: {
      value: '',
      isValid: true
    },
    complement: {
      value: '',
      isValid: true
    },
    state: {
      value: '',
      isValid: true
    }
  });

  const [touched, setTouched] = useState({
    customerName: false,
    birthDate: false,
    cpf: false,
    gender: false,
    maritalStatus: false,
    ethnicity: false,
    placeOfBirth: false,
    occupation: false,
    phoneNumber: false,
    email: false,
    instagramAccount: false,
    cep: false,
    street: false,
    number: false,
    district: false,
    city: false,
    complement: false,
    state: false
  });

  const [errors, setErrors] = useState<ErrorType>({
    customerName: null,
    birthDate: null,
    cpf: null,
    gender: null,
    maritalStatus: null,
    ethnicity: null,
    placeOfBirth: null,
    occupation: null,
    phoneNumber: null,
    email: null,
    instagramAccount: null,
    cep: null,
    street: null,
    number: null,
    district: null,
    city: null,
    complement: null,
    state: null
  });

  const [scrollTos, setScrollTo] = useState({
    customerName: false,
    birthDate: false,
    phoneNumber: false
  });

  const getAddressInfoByCEP = async (cep: string) => {
    setIsLoading(true);
    const postalServiceReponse = await getCepInfo(cep);
    if (postalServiceReponse.ok) {
      const address = postalServiceReponse.body as PostalServiceResponse;
      handleChange('street', address.logradouro!);
      handleChange('district', address.bairro!);
      handleChange('city', address.localidade!);
      handleChange('state', address.uf!);
    } else {
      const notification = {
        status: 'error',
        title: 'Erro ao buscar o CEP',
        message: 'Insira os campos do endereço manualmente!'
      };
      notificationCtx.showNotification(notification);
    }
    setIsLoading(false);
    Keyboard.dismiss();
  };

  const handleChange = (field: string, enteredValue: any) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
    setInputs((curInputs) => {
      if (field === 'cep') {
        const unmaskedCep = enteredValue.replace('-', '');
        if (unmaskedCep.length === 8) {
          getAddressInfoByCEP(unmaskedCep);
        }
        enteredValue = maskCEP(enteredValue);
      }
      if (field === 'cpf') {
        enteredValue = maskCPF(enteredValue);
      }
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

  const handleScrollTo = (field: string, value: boolean) => {
    setScrollTo((curScroll) => {
      curScroll[field] = value;
      return curScroll;
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
      if (!customerNameIsValid) {
        handleScrollTo('customerName', true);
        return false;
      }
      if (!phoneNumberIsValid) {
        handleScrollTo('phoneNumber', true);
        return false;
      }
      return false;
    }
  };

  const submitHandler = () => {
    if (validateForm(inputs, true)) {
      setIsLoading(true);

      const callCreateUpdateCustomerApi = async () => {
        const request = new CreateCustomerRequest(
          inputs.customerName.value,
          inputs.birthDate.value,
          inputs.cpf.value,
          inputs.gender.value,
          inputs.maritalStatus.value,
          inputs.ethnicity.value,
          inputs.placeOfBirth.value,
          inputs.occupation.value,
          inputs.phoneNumber.value,
          inputs.instagramAccount.value,
          inputs.email.value,
          inputs.cep.value,
          inputs.street.value,
          inputs.number.value,
          inputs.district.value,
          inputs.city.value,
          inputs.complement.value,
          inputs.state.value
        );

        const response = await createCustomer(authCtx.token?.access_token!, request);

        if (response.ok) {
          navigation.replace('EditPatient', {
            customerId: response.body.customerId,
            customerName: response.body.customerName,
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
      <KeyboardAwareScrollView
        innerRef={(ref) => {
          scrollViewRef.current = ref;
        }}
        contentContainerStyle={styles.content}
      >
        <AccordionItem title="Identificação" initiallyExpanded={true}>
          <Input
            field="customerName"
            label="Nome:"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
            scrollTos={scrollTos}
            handleScrollTo={handleScrollTo}
            scrollViewRef={scrollViewRef}
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
          <Input
            field="cpf"
            label="CPF (Opcional):"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
          />
          <Dropdown
            field="gender"
            label="Sexo (Opcional):"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            data={[
              { label: 'Masculino', value: 'male' },
              { label: 'Feminino', value: 'female' }
            ]}
          />
          <Dropdown
            field="maritalStatus"
            label="Estado Civil (Opcional):"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            data={[
              { label: 'Solteiro', value: 'single' },
              { label: 'Casado', value: 'married' },
              { label: 'Separado', value: 'separeted' },
              { label: 'Divorciado', value: 'divorced' },
              { label: 'Viúvo', value: 'widowed' }
            ]}
          />
          <Dropdown
            field="ethnicity"
            label="Cor ou Raça/Etnia (Opcional):"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            data={[
              { label: 'Preto', value: 'preto' },
              { label: 'Pardo', value: 'pardo' },
              { label: 'Branco', value: 'branco' },
              { label: 'Indígena', value: 'indigena' },
              { label: 'Amarelo', value: 'amarelo' }
            ]}
          />

          <Input
            field="occupation"
            label="Profissão (Opcional):"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
          />

          <Input
            field="placeOfBirth"
            label="Cidade de Nascimento (Opcional):"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
          />
        </AccordionItem>

        <AccordionItem title="Contatos" initiallyExpanded={true}>
          <Input
            field="phoneNumber"
            label="Telefone:"
            keyboardType="phone-pad"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
            scrollTos={scrollTos}
            handleScrollTo={handleScrollTo}
            scrollViewRef={scrollViewRef}
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
            field="instagramAccount"
            label="Instagram (Opcional):"
            keyboardType="default"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
          />
        </AccordionItem>

        <AccordionItem title="Endereço (Opcional)" initiallyExpanded={true}>
          <Input
            field="cep"
            label="Cep:"
            keyboardType="number-pad"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
          />

          <Input
            field="street"
            label="Rua:"
            keyboardType="default"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
          />

          <Input
            field="number"
            label="Número:"
            keyboardType="number-pad"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
          />

          <Input
            field="complement"
            label="Complemento:"
            keyboardType="default"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
          />

          <Input
            field="district"
            label="Bairro:"
            keyboardType="default"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
          />

          <Input
            field="city"
            label="Cidade:"
            keyboardType="default"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            onBlurHandler={handleBlur}
          />

          <DropdownModal
            visible={statesModalVisible}
            setVisible={setStatesModalVisible}
            field="state"
            label="Estado:"
            values={inputs}
            touched={touched}
            errors={errors}
            onChangeHandler={handleChange}
            data={[
              { label: 'Acre', value: 'AC' },
              { label: 'Alagoas', value: 'AL' },
              { label: 'Amapá', value: 'AP' },
              { label: 'Amazonas', value: 'AM' },
              { label: 'Bahia', value: 'BA' },
              { label: 'Ceará', value: 'CE' },
              { label: 'Espírito Santo', value: 'ES' },
              { label: 'Goiás', value: 'GO' },
              { label: 'Maranhão', value: 'MA' },
              { label: 'Mato Grosso', value: 'MT' },
              { label: 'Mato Grosso do Sul', value: 'MS' },
              { label: 'Minas Gerais', value: 'MG' },
              { label: 'Pará', value: 'PA' },
              { label: 'Paraíba', value: 'PB' },
              { label: 'Paraná', value: 'PR' },
              { label: 'Pernambuco', value: 'PE' },
              { label: 'Piauí', value: 'PI' },
              { label: 'Rio de Janeiro', value: 'RJ' },
              { label: 'Rio Grande do Norte', value: 'RN' },
              { label: 'Rio Grande do Sul', value: 'RS' },
              { label: 'Rondônia', value: 'RO' },
              { label: 'Roraima', value: 'RR' },
              { label: 'Santa Catarina', value: 'SC' },
              { label: 'São Paulo', value: 'SP' },
              { label: 'Sergipe', value: 'SE' },
              { label: 'Tocantins', value: 'TO' },
              { label: 'Distrito Federal', value: 'DF' }
            ]}
          />
        </AccordionItem>

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
    alignItems: 'flex-end',
    marginBottom: 30
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
