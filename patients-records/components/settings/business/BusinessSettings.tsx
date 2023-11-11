import { Colors } from '../../../constants/styles';
import useAsyncErrorHandler from '../../../hooks/useAsyncErrorHandler';
import { getAccountSettings, updateAccountSettings } from '../../../http/SettingsApi';
import GetAccountSettingsResponse from '../../../models/settings/accounts/GetAccountSettingsResponse';
import UpdateAccountSettingsRequest from '../../../models/settings/accounts/UpdateAccountSettingsRequest';
import { AuthContext } from '../../../store/auth-context';
import { validateCNPJ } from '../../../util/field-validations';
import { maskCNPJ } from '../../../util/mask-functions';
import Button, { ButtonTypes } from '../../ui/Button';
import Input from '../../ui/custom-form/Input';

import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Snackbar } from 'react-native-paper';

type Props = {
  navigation: any;
};

type Inputs = {
  companyName: {
    value: string | undefined;
    isValid: boolean;
  };
  companyCNPJ: {
    value: string | undefined;
    isValid: boolean;
  };
  companyNumberOfEmployees: {
    value: string | undefined;
    isValid: boolean;
  };
};

type Touched = {
  companyName: boolean;
  companyCNPJ: boolean;
  companyNumberOfEmployees: boolean;
};

type Errors = {
  companyName: string | undefined;
  companyCNPJ: string | undefined;
  companyNumberOfEmployees: string | undefined;
};

const BusinessSettings: React.FC<Props> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const asyncErrorHandler = useAsyncErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accountSettingsFromServer, setAccountSettingsFromServer] = useState<
    GetAccountSettingsResponse | undefined
  >(undefined);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [yPosition, setYPosition] = useState<number>(0);
  const isFocused = useIsFocused();

  const [inputs, setInputs] = useState<Inputs>({
    companyName: {
      value: '',
      isValid: true
    },
    companyCNPJ: {
      value: '',
      isValid: true
    },
    companyNumberOfEmployees: {
      value: '',
      isValid: true
    }
  });

  const [touched, setTouched] = useState<Touched>({
    companyName: false,
    companyCNPJ: false,
    companyNumberOfEmployees: false
  });

  const [errors, setErrors] = useState<Errors>({
    companyName: undefined,
    companyCNPJ: undefined,
    companyNumberOfEmployees: undefined
  });

  const validadeCompanyName = (newCompanyName: string | undefined) => {
    if (!newCompanyName) {
      return true;
    }

    if (/[\w]*/.test(newCompanyName)) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          companyName: undefined
        };
      });

      return true;
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          companyName: 'Nome da empresa é inválido!'
        };
      });
      return false;
    }
  };

  const validadeCNPJInternal = (newCompanyCNPJ: string | undefined) => {
    if (!newCompanyCNPJ) {
      return true;
    }
    if (validateCNPJ(newCompanyCNPJ)) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          companyCNPJ: undefined
        };
      });

      return true;
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          companyCNPJ: 'CNPJ é inválido!'
        };
      });
      return false;
    }
  };

  const validadeCompanyNumberOfEmployees = (newCompanyNumberOfEmployees: string | undefined) => {
    if (!newCompanyNumberOfEmployees) {
      return true;
    }

    if (/^[0-9]*$/.test(newCompanyNumberOfEmployees)) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          companyNumberOfEmployees: undefined
        };
      });

      return true;
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          companyNumberOfEmployees: 'Valor é inválido!'
        };
      });
      return false;
    }
  };

  const handleChange = (field: string, enteredValue: any) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
    setInputs((curInputs) => {
      if (field === 'companyCNPJ') {
        enteredValue = maskCNPJ(enteredValue);
      }
      console.log(`${field}: ${enteredValue}`);
      const newInputs = {
        ...curInputs,
        [field]: { value: enteredValue, isValid: true }
      };
      return newInputs;
    });
  };

  const handleBlur = (field: string) => {
    setTouched((curTouched) => {
      if (field === 'companyName') {
        validadeCompanyName(inputs.companyName.value);
      }
      if (field === 'companyCNPJ') {
        validadeCNPJInternal(inputs.companyCNPJ.value);
      }
      if (field === 'companyNumberOfEmployees') {
        validadeCompanyNumberOfEmployees(inputs.companyNumberOfEmployees.value);
      }
      curTouched[field] = true;
      return curTouched;
    });
  };

  const submitHandler = async () => {
    if (
      Object.values(errors).some((value) => value !== undefined) ||
      !validadeCompanyName(inputs.companyName.value) ||
      !validadeCNPJInternal(inputs.companyCNPJ.value) ||
      !validadeCompanyNumberOfEmployees(inputs.companyNumberOfEmployees.value)
    ) {
      return;
    }

    setIsLoading(true);

    const request = { ...accountSettingsFromServer } as unknown as UpdateAccountSettingsRequest;
    request.companyName = inputs.companyName.value;
    request.companyCNPJ = inputs.companyCNPJ.value;
    request.companyNumberOfEmployees = inputs.companyNumberOfEmployees.value;
    console.log(`inputs.companyNumberOfEmployees.value: ${inputs.companyNumberOfEmployees.value}`);

    try {
      const response = await updateAccountSettings(authCtx.token?.access_token!, request);
      if (response.ok) {
        setVisibleSnackbar(true);
        setTimeout(() => {
          setVisibleSnackbar(false);
        }, 5000);
      } else {
        asyncErrorHandler(
          new Error(`BusinessSettings.submitHandler - else: ${JSON.stringify(response)}`, {
            cause: response.httpStatusCode
          })
        );
      }
    } catch (error: any) {
      asyncErrorHandler(
        new Error(`BusinessSettings.submitHandler - catch: ${JSON.stringify(error)}`, {
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
            companyName: {
              value: getAccountSettingsResponse.companyName,
              isValid: true
            },
            companyCNPJ: {
              value: getAccountSettingsResponse.companyCNPJ,
              isValid: true
            },
            companyNumberOfEmployees: {
              value: getAccountSettingsResponse.companyNumberOfEmployees + '',
              isValid: true
            }
          });
        } else {
          asyncErrorHandler(
            new Error(
              `BusinessSettings.getAccountSettingsAsync - else: ${JSON.stringify(response)}`,
              {
                cause: response.httpStatusCode
              }
            )
          );
        }
      } catch (error: any) {
        asyncErrorHandler(
          new Error(`BusinessSettings.getAccountSettingsAsync - catch: ${JSON.stringify(error)}`, {
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
          field="companyName"
          label="Nome da Empresa (Opcional):"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          textContentType="organizationName"
        />
        <Input
          field="companyCNPJ"
          label="CNPJ (Opcional):"
          keyboardType="number-pad"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
        />
        <Input
          field="companyNumberOfEmployees"
          label="Nº Funcionários (Opcional):"
          keyboardType="number-pad"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
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

export default BusinessSettings;

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
