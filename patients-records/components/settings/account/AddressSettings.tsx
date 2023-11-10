import Button, { ButtonTypes } from '../../../components/ui/Button';
import Input from '../../../components/ui/custom-form/Input';
import DropdownModal from '../../../components/ui/DropdownModal';
import { Colors } from '../../../constants/styles';
import useAsyncErrorHandler from '../../../hooks/useAsyncErrorHandler';
import { getCepInfo } from '../../../http/PostalService';
import { getAccountSettings, updateAccountSettings } from '../../../http/SettingsApi';
import { PostalServiceResponse } from '../../../models/postal-service/PostalServiceResponse';
import GetAccountSettingsResponse from '../../../models/settings/accounts/GetAccountSettingsResponse';
import UpdateAccountSettingsRequest from '../../../models/settings/accounts/UpdateAccountSettingsRequest';
import { AuthContext } from '../../../store/auth-context';
import { validateCEP } from '../../../util/field-validations';
import { maskCEP } from '../../../util/mask-functions';

import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Keyboard, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Snackbar } from 'react-native-paper';

type Props = {
  navigation: any;
};

type Inputs = {
  userAddressCEP: {
    value: string;
    isValid: boolean;
  };
  userAddressStreet: {
    value: string;
    isValid: boolean;
  };
  userAddressNumber: {
    value: string;
    isValid: boolean;
  };
  userAddressDistrict: {
    value: string;
    isValid: boolean;
  };
  userAddressCity: {
    value: string;
    isValid: boolean;
  };
  userAddressComplement: {
    value: string;
    isValid: boolean;
  };
  userAddressState: {
    value: string;
    isValid: boolean;
  };
};

type Touched = {
  userAddressCEP: boolean;
  userAddressStreet: boolean;
  userAddressNumber: boolean;
  userAddressDistrict: boolean;
  userAddressCity: boolean;
  userAddressComplement: boolean;
  userAddressState: boolean;
};

type Errors = {
  userAddressCEP: string | undefined;
  userAddressStreet: string | undefined;
  userAddressNumber: string | undefined;
  userAddressDistrict: string | undefined;
  userAddressCity: string | undefined;
  userAddressComplement: string | undefined;
  userAddressState: string | undefined;
};

const AddressSettings: React.FC<Props> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const asyncErrorHandler = useAsyncErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accountSettingsFromServer, setAccountSettingsFromServer] = useState<
    GetAccountSettingsResponse | undefined
  >(undefined);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [yPosition, setYPosition] = useState<number>(0);
  const [statesModalVisible, setStatesModalVisible] = useState<boolean>(false);
  const isFocused = useIsFocused();

  const [inputs, setInputs] = useState<Inputs>({
    userAddressCEP: {
      value: '',
      isValid: true
    },
    userAddressStreet: {
      value: '',
      isValid: true
    },
    userAddressNumber: {
      value: '',
      isValid: true
    },
    userAddressDistrict: {
      value: '',
      isValid: true
    },
    userAddressCity: {
      value: '',
      isValid: true
    },
    userAddressComplement: {
      value: '',
      isValid: true
    },
    userAddressState: {
      value: '',
      isValid: true
    }
  });

  const [touched, setTouched] = useState<Touched>({
    userAddressCEP: false,
    userAddressStreet: false,
    userAddressNumber: false,
    userAddressDistrict: false,
    userAddressCity: false,
    userAddressComplement: false,
    userAddressState: false
  });

  const [errors, setErrors] = useState<Errors>({
    userAddressCEP: undefined,
    userAddressStreet: undefined,
    userAddressNumber: undefined,
    userAddressDistrict: undefined,
    userAddressCity: undefined,
    userAddressComplement: undefined,
    userAddressState: undefined
  });

  const getAddressInfoByCEP = async (cep: string) => {
    setIsLoading(true);
    try {
      const postalServiceReponse = await getCepInfo(cep);
      if (postalServiceReponse.ok) {
        const address = postalServiceReponse.body as PostalServiceResponse;
        handleChange('userAddressStreet', address.logradouro!);
        handleChange('userAddressDistrict', address.bairro!);
        handleChange('userAddressCity', address.localidade!);
        handleChange('userAddressState', address.uf!);
      } else {
        asyncErrorHandler(
          new Error(
            `AddressSettings.getAddressInfoByCEP - else: ${JSON.stringify(postalServiceReponse)}`,
            {
              cause: postalServiceReponse.httpStatusCode
            }
          )
        );
      }
    } catch (error: any) {
      asyncErrorHandler(
        new Error(`AddressSettings.submitHandler - catch: ${JSON.stringify(error)}`, {
          cause: error.message
        })
      );
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
      if (field === 'userAddressCEP') {
        if (enteredValue.length === 9) {
          const unmaskedCep = enteredValue.replace('-', '');
          getAddressInfoByCEP(unmaskedCep);
        }
        enteredValue = maskCEP(enteredValue);
      }
      const newInputs = {
        ...curInputs,
        [field]: { value: enteredValue, isValid: true }
      };
      return newInputs;
    });
  };

  const validateCEPInternal = (newCep: string): boolean => {
    if (validateCEP(newCep)) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          userAddressCEP: undefined
        };
      });

      return true;
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          userAddressCEP: 'Campo inválido!'
        };
      });
      return false;
    }
  };

  const validateStringInputs = (str: string, field: string): boolean => {
    if (str !== null && str !== undefined && str.trim().length > 0) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          [field]: undefined
        };
      });

      return true;
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          [field]: 'Campo inválido!'
        };
      });
      return false;
    }
  };

  const handleBlur = (field: string) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      if (field === 'userAddressCEP') {
        validateCEPInternal(inputs.userAddressCEP.value);
      }
      if (field === 'userAddressStreet') {
        validateStringInputs(inputs.userAddressStreet.value, field);
      }
      if (field === 'userAddressNumber') {
        validateStringInputs(inputs.userAddressNumber.value, field);
      }
      if (field === 'userAddressDistrict') {
        validateStringInputs(inputs.userAddressDistrict.value, field);
      }
      if (field === 'userAddressCity') {
        validateStringInputs(inputs.userAddressCity.value, field);
      }
      if (field === 'userAddressState') {
        validateStringInputs(inputs.userAddressState.value, field);
      }
      return curTouched;
    });
  };

  const submitHandler = async () => {
    if (
      Object.values(errors).some((value) => value !== undefined) ||
      !validateCEPInternal(inputs.userAddressCEP.value) ||
      !validateStringInputs(inputs.userAddressStreet.value, 'userAddressStreet') ||
      !validateStringInputs(inputs.userAddressNumber.value, 'userAddressNumber') ||
      !validateStringInputs(inputs.userAddressDistrict.value, 'userAddressDistrict') ||
      !validateStringInputs(inputs.userAddressCity.value, 'userAddressCity') ||
      !validateStringInputs(inputs.userAddressState.value, 'userAddressState')
    ) {
      return;
    }

    setIsLoading(true);

    const request = { ...accountSettingsFromServer } as unknown as UpdateAccountSettingsRequest;
    request.userAddressCEP = inputs.userAddressCEP.value;
    request.userAddressStreet = inputs.userAddressStreet.value;
    request.userAddressNumber = inputs.userAddressNumber.value;
    request.userAddressComplement = inputs.userAddressComplement.value;
    request.userAddressDistrict = inputs.userAddressDistrict.value;
    request.userAddressCity = inputs.userAddressCity.value;
    request.userAddressState = inputs.userAddressState.value;

    try {
      const response = await updateAccountSettings(authCtx.token?.access_token!, request);
      if (response.ok) {
        setVisibleSnackbar(true);
        setTimeout(() => {
          setVisibleSnackbar(false);
        }, 5000);
      } else {
        asyncErrorHandler(
          new Error(`AddressSettings.submitHandler - else: ${JSON.stringify(response)}`, {
            cause: response.httpStatusCode
          })
        );
      }
    } catch (error: any) {
      asyncErrorHandler(
        new Error(`AddressSettings.submitHandler - catch: ${JSON.stringify(error)}`, {
          cause: error.message
        })
      );
    }

    setIsLoading(false);
  };

  useEffect(() => {
    const getAccountSettingsAsync = async () => {
      setIsLoading(true);

      try {
        const response = await getAccountSettings(authCtx.token?.access_token!);
        if (response.ok) {
          const getAccountSettingsResponse = response.body as GetAccountSettingsResponse;
          setAccountSettingsFromServer(getAccountSettingsResponse);
          setInputs({
            userAddressCEP: {
              value: getAccountSettingsResponse.userAddressCEP,
              isValid: true
            },
            userAddressStreet: {
              value: getAccountSettingsResponse.userAddressStreet,
              isValid: true
            },
            userAddressNumber: {
              value: getAccountSettingsResponse.userAddressNumber,
              isValid: true
            },
            userAddressDistrict: {
              value: getAccountSettingsResponse.userAddressDistrict,
              isValid: true
            },
            userAddressCity: {
              value: getAccountSettingsResponse.userAddressCity,
              isValid: true
            },
            userAddressComplement: {
              value: getAccountSettingsResponse.userAddressComplement,
              isValid: true
            },
            userAddressState: {
              value: getAccountSettingsResponse.userAddressState,
              isValid: true
            }
          });
        } else {
          asyncErrorHandler(
            new Error(
              `AccountSettings.getAccountSettingsAsync - else: ${JSON.stringify(response)}`,
              {
                cause: response.httpStatusCode
              }
            )
          );
        }
      } catch (error: any) {
        asyncErrorHandler(
          new Error(`AccountSettings.getAccountSettingsAsync - catch: ${JSON.stringify(error)}`, {
            cause: error.message
          })
        );
      }

      setIsLoading(false);
    };
    if (isFocused) {
      getAccountSettingsAsync();
    }
  }, [asyncErrorHandler, authCtx.token?.access_token, isFocused]);

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
      <Snackbar
        visible={visibleSnackbar}
        onDismiss={() => {}}
        wrapperStyle={{
          zIndex: 7000,
          top: yPosition,
          alignContent: 'center',
          alignItems: 'center'
        }}
        style={{
          backgroundColor: Colors.secondary500,
          alignSelf: 'center'
        }}
      >
        Alterações salvas com sucesso!
      </Snackbar>
      <KeyboardAwareScrollView
        contentContainerStyle={styles.keyboardAwareStyle}
        onScroll={(event) => {
          setYPosition(event.nativeEvent.contentOffset.y);
        }}
      >
        <Input
          field="userAddressCEP"
          label="Cep:"
          keyboardType="number-pad"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          textContentType="postalCode"
        />
        <Input
          field="userAddressStreet"
          label="Rua:"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
        />
        <Input
          field="userAddressNumber"
          label="Número:"
          keyboardType="number-pad"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
        />
        <Input
          field="userAddressComplement"
          label="Complemento (Opcional):"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
        />
        <Input
          field="userAddressDistrict"
          label="Bairro:"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
        />
        <Input
          field="userAddressCity"
          label="Cidade:"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          textContentType="addressCity"
        />

        <DropdownModal
          visible={statesModalVisible}
          setVisible={setStatesModalVisible}
          field="userAddressState"
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
        <View style={styles.buttons}>
          <Button
            type={ButtonTypes.Primary_Bordered}
            onPress={submitHandler}
            text={styles.buttonTextStyles}
            pressable={[styles.buttonPressable]}
          >
            Salvar
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default AddressSettings;

const styles = StyleSheet.create({
  keyboardAwareStyle: {
    padding: 30
  },
  buttons: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 30,
    marginTop: 15
  },
  buttonPressable: {
    flex: 1,
    marginHorizontal: 3
  },
  buttonTextStyles: { fontSize: 20 }
});
