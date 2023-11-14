import Button, { ButtonTypes } from '../../../components/ui/Button';
import Input from '../../../components/ui/custom-form/Input';
import { Colors } from '../../../constants/styles';
import useAsyncErrorHandler from '../../../hooks/useAsyncErrorHandler';
import { getAccountSettings, updateAccountSettings } from '../../../http/SettingsApi';
import GetAccountSettingsResponse from '../../../models/settings/accounts/GetAccountSettingsResponse';
import UpdateAccountSettingsRequest from '../../../models/settings/accounts/UpdateAccountSettingsRequest';
import { AuthContext } from '../../../store/auth-context';

import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Snackbar } from 'react-native-paper';

type Props = {
  navigation: any;
};

type Inputs = {
  email: {
    value: string;
    isValid: boolean;
  };
  phoneNumber: {
    value: string;
    isValid: boolean;
  };
};

type Touched = {
  email: boolean;
  phoneNumber: boolean;
};

type Errors = {
  email: string | undefined;
  phoneNumber: string | undefined;
};

const ContactsSettings: React.FC<Props> = ({ navigation }) => {
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
    email: {
      value: '',
      isValid: true
    },
    phoneNumber: {
      value: '',
      isValid: true
    }
  });

  const [touched, setTouched] = useState<Touched>({
    email: false,
    phoneNumber: false
  });

  const [errors, setErrors] = useState<Errors>({
    email: undefined,
    phoneNumber: undefined
  });

  const validatePhoneNumber = (newPhoneNumber: string): boolean => {
    console.log(`phoneNumber: ${newPhoneNumber}`);
    // eslint-disable-next-line no-useless-escape
    if (/^\(\d{2}\)\s[\d]{5}-[\d]{4}$/.test(newPhoneNumber)) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          phoneNumber: undefined
        };
      });

      return true;
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          phoneNumber: 'Número de telefone inválido!'
        };
      });
      return false;
    }
  };

  const validateEmail = (newEmail: string): boolean => {
    // eslint-disable-next-line no-useless-escape
    if (/^([a-z0-9_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,63})$/.test(newEmail)) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          email: undefined
        };
      });
      return true;
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          email: 'E-mail inválido!'
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
      const newInputs = {
        ...curInputs,
        [field]: { value: enteredValue, isValid: true }
      };
      return newInputs;
    });
  };

  const handleBlur = (field: string) => {
    setTouched((curTouched) => {
      if (field === 'phoneNumber') {
        validatePhoneNumber(inputs.phoneNumber.value);
      }
      if (field === 'email') {
        validateEmail(inputs.email.value);
      }
      curTouched[field] = true;
      return curTouched;
    });
  };

  const submitHandler = async () => {
    if (
      Object.values(errors).some((value) => value !== undefined) ||
      !validatePhoneNumber(inputs.phoneNumber.value) ||
      !validateEmail(inputs.email.value)
    ) {
      return;
    }

    setIsLoading(true);

    const request = { ...accountSettingsFromServer } as unknown as UpdateAccountSettingsRequest;
    request.email = inputs.email.value;
    request.phoneNumber = inputs.phoneNumber.value;

    try {
      const response = await updateAccountSettings(authCtx.token?.access_token!, request);
      if (response.ok) {
        if (!authCtx.userInfo?.userCreationCompleted) {
          navigation.navigate('BusinessInfo');
        } else {
          setVisibleSnackbar(true);
          setTimeout(() => {
            setVisibleSnackbar(false);
          }, 5000);
        }
      } else {
        asyncErrorHandler(
          new Error(`ContactsSettings.submitHandler - else: ${JSON.stringify(response)}`, {
            cause: response.httpStatusCode
          })
        );
      }
    } catch (error: any) {
      asyncErrorHandler(
        new Error(`ContactsSettings.submitHandler - catch: ${JSON.stringify(error)}`, {
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
            email: {
              value: getAccountSettingsResponse.email,
              isValid: true
            },
            phoneNumber: {
              value: getAccountSettingsResponse.phoneNumber,
              isValid: true
            }
          });
        } else {
          asyncErrorHandler(
            new Error(
              `ContactsSettings.getAccountSettingsAsync - else: ${JSON.stringify(response)}`,
              {
                cause: response.httpStatusCode
              }
            )
          );
        }
      } catch (error: any) {
        asyncErrorHandler(
          new Error(`ContactsSettings.getAccountSettingsAsync - catch: ${JSON.stringify(error)}`, {
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
          field="phoneNumber"
          label="Whatsapp:"
          keyboardType="phone-pad"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          textContentType="telephoneNumber"
        />
        <Input
          field="email"
          label="E-mail:"
          keyboardType="email-address"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          textContentType="emailAddress"
        />
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

export default ContactsSettings;

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
