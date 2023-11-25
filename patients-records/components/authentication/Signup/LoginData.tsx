/* eslint-disable import/order */
import Button from '../../../components/ui/Button';
import { Colors } from '../../../constants/styles';
import useAsyncErrorHandler from '../../../hooks/useAsyncErrorHandler';
import { createUser } from '../../../http/AccountsApi';
import { CreateUserRequest } from '../../../models/user/CreateUserRequest';
import { CreateUserResponse } from '../../../models/user/CreateUserResponse';
import { AuthContext } from '../../../store/auth-context';
import { login } from '../../../util/auth';
import Input from '../../ui/custom-form/Input';

import { useContext, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Props {
  navigation: any;
}

type Inputs = {
  username: {
    value: string;
    isValid: boolean;
  };
  password: {
    value: string;
    isValid: boolean;
  };
  email: {
    value: string;
    isValid: boolean;
  };
};

type Touched = {
  username: boolean;
  password: boolean;
  email: boolean;
};

type Errors = {
  username: string | undefined;
  password: string | undefined;
  email: string | undefined;
};

const LoginData: React.FC<Props> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const asyncErrorHandler = useAsyncErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [inputs, setInputs] = useState<Inputs>({
    username: {
      value: '',
      isValid: true
    },
    password: {
      value: '',
      isValid: true
    },
    email: {
      value: '',
      isValid: true
    }
  });

  const [touched, setTouched] = useState<Touched>({
    username: false,
    password: false,
    email: false
  });

  const [errors, setErrors] = useState<Errors>({
    username: undefined,
    password: undefined,
    email: undefined
  });

  const validateUsername = (newUsername: string) => {
    if (/^(?=[a-zA-Z])[\s\wáéíóúâêîôûãõç-]{3,32}$/.test(newUsername)) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          username: undefined
        };
      });
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          username:
            'Nome de usuário inválido!\nDeve conter de 3 a 16 caracteres incluindo letras e números, iniciando com uma letra.'
        };
      });
    }
  };

  const validatePassword = (newPassword: string) => {
    if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$^&*()_-]).{8,18}$/.test(newPassword)) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          password: undefined
        };
      });
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          password:
            'Senha inválida!\nDeve conter de 8 a 18 caracteres incluindo uma letra minúscula, uma letra maiúscula, um algarismo e um carácter especial (!@#$^&*()_-).'
        };
      });
    }
  };

  const validateEmail = (newEmail: string) => {
    // eslint-disable-next-line no-useless-escape
    if (/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$/.test(newEmail)) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          email: undefined
        };
      });
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          email: 'E-mail inválido!'
        };
      });
    }
  };

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
      return newInputs;
    });
  };

  const handleBlur = (field: string) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      if (field === 'username') {
        validateUsername(inputs.username.value);
      }
      if (field === 'password') {
        validatePassword(inputs.password.value);
      }
      if (field === 'email') {
        validateEmail(inputs.email.value);
      }
      return curTouched;
    });
  };

  const submitHandler = async () => {
    if (
      Object.values(errors).some(
        (value) => value !== undefined || Object.values(touched).some((value) => value === false)
      )
    ) {
      return;
    }

    setIsLoading(true);

    const request = new CreateUserRequest(
      inputs.email.value,
      inputs.username.value,
      inputs.password.value
    );

    try {
      const response = await createUser(request);
      if (response.ok) {
        const createUserResponse = response.body as CreateUserResponse;
        const accessToken = await login(createUserResponse.email, inputs.password.value);
        if (accessToken) {
          authCtx.authenticate(accessToken, {
            userId: accessToken.userId,
            username: accessToken.username,
            email: accessToken.email,
            userCreationCompleted: accessToken.userCreationCompleted,
            userPlanId: accessToken.userPlanId,
            paymentOk: accessToken.paymentOk,
            companyName: accessToken.companyName
          });
        } else {
          asyncErrorHandler(
            new Error(`LoginData.submitHandler - trying to login:`, {
              cause: response.httpStatusCode
            })
          );
        }
      } else {
        asyncErrorHandler(
          new Error(`LoginData.submitHandler - else: ${JSON.stringify(response)}`, {
            cause: response.httpStatusCode
          })
        );
      }
    } catch (error: any) {
      asyncErrorHandler(
        new Error(`LoginData.submitHandler - catch: ${JSON.stringify(error)}`, {
          cause: error.message
        })
      );
    }

    setIsLoading(false);
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
      <KeyboardAwareScrollView contentContainerStyle={styles.keyboardAwareStyle}>
        {/* <AccordionItem title="Dados de Acesso" initiallyExpanded={true}> */}
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
        <Input
          field="password"
          label="Senha:"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          textContentType="newPassword"
          secureTextEntry={true}
        />
        <Input
          field="email"
          label="E-mail:"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          textContentType="emailAddress"
        />
        <View style={styles.buttons}>
          <Button view={{ paddingVertical: 1 }} onPress={submitHandler}>
            Criar
          </Button>
        </View>
        {/* </AccordionItem> */}
      </KeyboardAwareScrollView>
    </>
  );
};

export default LoginData;

const styles = StyleSheet.create({
  facebookContent: {
    marginTop: 10,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary800
    // elevation: 2,
    // shadowColor: '#000000',
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.35,
    // shadowRadius: 4
  },
  keyboardAwareStyle: {
    padding: 30
  },
  buttons: {
    marginTop: 8,
    color: Colors.primary500
  }
});
