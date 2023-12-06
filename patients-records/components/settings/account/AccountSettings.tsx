import Button, { ButtonTypes } from '../../../components/ui/Button';
import DatePickerV2 from '../../../components/ui/custom-form/DatePickerV2';
import Input from '../../../components/ui/custom-form/Input';
import Dropdown from '../../../components/ui/Dropdown';
import { Colors } from '../../../constants/styles';
import useAsyncErrorHandler from '../../../hooks/useAsyncErrorHandler';
import { getAccountSettings, updateAccountSettings } from '../../../http/SettingsApi';
import GetAccountSettingsResponse from '../../../models/settings/accounts/GetAccountSettingsResponse';
import UpdateAccountSettingsRequest from '../../../models/settings/accounts/UpdateAccountSettingsRequest';
import { AuthContext } from '../../../store/auth-context';
import { validateCPF } from '../../../util/field-validations';
import { maskCPF } from '../../../util/mask-functions';

import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Snackbar } from 'react-native-paper';

type Props = {
  navigation: any;
};

type Inputs = {
  userNameComplete: {
    value: string;
    isValid: boolean;
  };
  userBirthdate: {
    value: Date;
    isValid: boolean;
  };
  userGender: {
    value: string;
    isValid: boolean;
  };
  userCPF: {
    value: string;
    isValid: boolean;
  };
  username: {
    value: string;
    isValid: boolean;
  };
  password: {
    value: string;
    isValid: boolean;
  };
};

type Touched = {
  userNameComplete: boolean;
  userBirthdate: boolean;
  userGender: boolean;
  userCPF: boolean;
  username: boolean;
  password: boolean;
};

type Errors = {
  userNameComplete: string | undefined;
  userBirthdate: string | undefined;
  userGender: string | undefined;
  userCPF: string | undefined;
  username: string | undefined;
  password: string | undefined;
};

const AccountSettings: React.FC<Props> = ({ navigation }) => {
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
    userNameComplete: {
      value: '',
      isValid: true
    },
    userBirthdate: {
      value: new Date(),
      isValid: true
    },
    userGender: {
      value: '',
      isValid: true
    },
    userCPF: {
      value: '',
      isValid: true
    },
    username: {
      value: '',
      isValid: true
    },
    password: {
      value: '',
      isValid: true
    }
  });

  const [touched, setTouched] = useState<Touched>({
    userNameComplete: false,
    userBirthdate: false,
    userGender: false,
    userCPF: false,
    username: false,
    password: false
  });

  const [errors, setErrors] = useState<Errors>({
    userNameComplete: undefined,
    userBirthdate: undefined,
    userGender: undefined,
    userCPF: undefined,
    username: undefined,
    password: undefined
  });

  const validateUsernameComplete = (newUsernameComplete: string): boolean => {
    if (/^(?=[a-zA-Z])[\s\wáéíóúâêîôûãõç-]{6,}$/.test(newUsernameComplete)) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          userNameComplete: undefined
        };
      });
      return true;
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          userNameComplete:
            'Nome inválido!\nDeve conter no mínimo 6 caracteres incluindo letras e números, iniciando com uma letra.'
        };
      });
      return false;
    }
  };

  const validateUserGender = (newUserGender: string): boolean => {
    if (/(?:male|female|others)$/.test(newUserGender)) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          userGender: undefined
        };
      });
      return true;
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          userGender: 'Gênero inválido!'
        };
      });
      return false;
    }
  };

  const validateBirthdate = (newBirthdate: Date): boolean => {
    const now = new Date();

    if (typeof newBirthdate === 'string') {
      newBirthdate = new Date(newBirthdate);
    }

    if (newBirthdate.getTime() < now.getTime()) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          userBirthdate: undefined
        };
      });
      return true;
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          userBirthdate: 'Date de nascimento é inválida!'
        };
      });
      return false;
    }
  };

  const validateUserCPF = (newCpf: string): boolean => {
    if (validateCPF(newCpf)) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          userCPF: undefined
        };
      });
      return true;
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          userCPF: 'CPF é inválido!'
        };
      });
      return false;
    }
  };

  const validateUsername = (newUsername: string): boolean => {
    if (/^(?=[a-zA-Z])[\s\wáéíóúâêîôûãõç-]{3,32}$/.test(newUsername)) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          username: undefined
        };
      });
      return true;
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          username:
            'Nome de usuário inválido!\nDeve conter de 3 a 16 caracteres incluindo letras e números, iniciando com uma letra.'
        };
      });
      return false;
    }
  };

  const validatePassword = (newPassword: string): boolean => {
    if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$^&*()_-]).{8,18}$/.test(newPassword)) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          password: undefined
        };
      });
      return true;
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          password:
            'Senha inválida!\nDeve conter de 8 a 18 caracteres incluindo uma letra minúscula, uma letra maiúscula, um algarismo e um carácter especial (!@#$^&*()_-).'
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
      if (field === 'userCPF') {
        enteredValue = maskCPF(enteredValue);
      }
      const newInputs = {
        ...curInputs,
        [field]: { value: enteredValue, isValid: true }
      };
      return newInputs;
    });
  };

  const handleBlur = (field: string) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      if (field === 'userNameComplete') {
        validateUsernameComplete(inputs.userNameComplete.value);
      }
      if (field === 'userBirthdate') {
        validateBirthdate(inputs.userBirthdate.value);
      }
      if (field === 'userGender') {
        validateUserGender(inputs.userGender.value);
      }
      if (field === 'userCPF') {
        validateUserCPF(inputs.userCPF.value);
      }
      if (field === 'username') {
        validateUsername(inputs.username.value);
      }
      if (field === 'password') {
        validatePassword(inputs.password.value);
      }
      return curTouched;
    });
  };

  const submitHandler = async () => {
    if (
      Object.values(errors).some((value) => value !== undefined) ||
      !validateUsernameComplete(inputs.userNameComplete.value ?? '') ||
      !validateBirthdate(inputs.userBirthdate.value) ||
      !validateUserGender(inputs.userGender.value ?? '') ||
      !validateUserCPF(inputs.userCPF.value ?? '') ||
      !validateUsername(inputs.username.value ?? '')
    ) {
      return;
    }

    setIsLoading(true);

    const request = { ...accountSettingsFromServer } as unknown as UpdateAccountSettingsRequest;
    request.userNameComplete = inputs.userNameComplete.value;
    request.userBirthdate = inputs.userBirthdate.value;
    request.userGender = inputs.userGender.value;
    request.userCPF = inputs.userCPF.value;
    request.username = inputs.username.value;

    try {
      const response = await updateAccountSettings(authCtx.token?.access_token!, request);
      if (response.ok) {
        if (!authCtx.userInfo?.userCreationCompleted) {
          navigation.navigate('AddressSettingsScreen');
        } else {
          setVisibleSnackbar(true);
          setTimeout(() => {
            setVisibleSnackbar(false);
          }, 5000);
        }
      } else {
        asyncErrorHandler(
          new Error(`Signup.submitHandler - else: ${JSON.stringify(response)}`, {
            cause: response.httpStatusCode
          })
        );
      }
    } catch (error: any) {
      asyncErrorHandler(
        new Error(`Signup.submitHandler - catch: ${JSON.stringify(error)}`, {
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
            userNameComplete: {
              value: getAccountSettingsResponse.userNameComplete,
              isValid: true
            },
            userBirthdate: {
              value: getAccountSettingsResponse.userBirthdate
                ? new Date(getAccountSettingsResponse.userBirthdate)
                : new Date(),
              isValid: true
            },
            userGender: { value: getAccountSettingsResponse.userGender, isValid: true },
            userCPF: {
              value: getAccountSettingsResponse.userCPF,
              isValid: true
            },
            username: {
              value: getAccountSettingsResponse.username,
              isValid: true
            },
            password: {
              value: '',
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
          field="userNameComplete"
          label="Nome Completo:"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          textContentType="name"
        />
        <Dropdown
          field="userGender"
          label="Gênero:"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          data={[
            { label: 'Masculino', value: 'male' },
            { label: 'Feminino', value: 'female' },
            { label: 'Outros', value: 'others' }
          ]}
        />
        <DatePickerV2
          field="userBirthdate"
          label="Data de Nascimento:"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          buttonStyle={{ marginVertical: 8 }}
        />
        <Input
          field="userCPF"
          label="CPF:"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
        />
        <Input
          field="username"
          label="Nome de Usuário:"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          textContentType="username"
        />
        {/* <Input
          disabled={true}
          field="password"
          label="Nova Senha:"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          textContentType="newPassword"
          secureTextEntry={true}
        /> */}
        <View style={styles.buttons}>
          <Button
            type={ButtonTypes.Primary_Bordered}
            onPress={submitHandler}
            text={styles.buttonTextStyles}
            pressable={[styles.buttonPressable]}
          >
            {authCtx.userInfo?.userCreationCompleted ? 'Salvar' : 'Próximo'}
          </Button>
        </View>
      </KeyboardAwareScrollView>
    </>
  );
};

export default AccountSettings;

const styles = StyleSheet.create({
  keyboardAwareStyle: {
    padding: 30
  },
  buttons: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 30
  },
  buttonPressable: {
    flex: 1,
    marginHorizontal: 3
  },
  buttonTextStyles: { fontSize: 20 }
});
