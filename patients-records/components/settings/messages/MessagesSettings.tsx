import { Colors } from '../../../constants/styles';
import useAsyncErrorHandler from '../../../hooks/useAsyncErrorHandler';
import { getAccountSettings, updateAccountSettings } from '../../../http/SettingsApi';
import GetAccountSettingsResponse from '../../../models/settings/accounts/GetAccountSettingsResponse';
import UpdateAccountSettingsRequest from '../../../models/settings/accounts/UpdateAccountSettingsRequest';
import { AuthContext } from '../../../store/auth-context';
import Button, { ButtonTypes } from '../../ui/Button';
import Input from '../../ui/custom-form/Input';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ImageBackground, StyleSheet, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Snackbar } from 'react-native-paper';

const whatsappBackgroundImg = '../../../assets/whatsapp.png';

type Props = {
  navigation: any;
};

type Inputs = {
  referPronoun: {
    value: string;
    isValid: boolean;
  };
  messageProfessionalName: {
    value: string;
    isValid: boolean;
  };
};

type Touched = {
  referPronoun: boolean;
  messageProfessionalName: boolean;
};

type Errors = {
  referPronoun: string | undefined;
  messageProfessionalName: string | undefined;
};

const MessagesSettings: React.FC<Props> = ({ navigation }) => {
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
    referPronoun: {
      value: '',
      isValid: true
    },
    messageProfessionalName: {
      value: '',
      isValid: true
    }
  });

  const [touched, setTouched] = useState<Touched>({
    referPronoun: false,
    messageProfessionalName: false
  });

  const [errors, setErrors] = useState<Errors>({
    referPronoun: undefined,
    messageProfessionalName: undefined
  });

  const validateReferPronoun = (newReferPronoun: string): boolean => {
    // eslint-disable-next-line no-useless-escape
    if (/^[a-zA-Z\s\.]+$/.test(newReferPronoun)) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          referPronoun: undefined
        };
      });

      return true;
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          referPronoun: 'Pronome de tratamento inválido!'
        };
      });
      return false;
    }
  };

  const validateMessageProfessionalName = (newMessageProfessionalName: string): boolean => {
    // eslint-disable-next-line no-useless-escape
    if (/^[a-zA-Záéíóúâêîôûãõç][\s,\-_a-zA-Záéíóúâêîôûãõç]*$/i.test(newMessageProfessionalName)) {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          messageProfessionalName: undefined
        };
      });
      return true;
    } else {
      setErrors((curErrors) => {
        return {
          ...curErrors,
          messageProfessionalName:
            'Nome nas mensagens é inválido!\nApenas letras, espaços, vírgulas (,), hífens (_) e traços (-) são permitidos.'
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
      if (field === 'referPronoun') {
        validateReferPronoun(inputs.referPronoun.value);
      }
      if (field === 'messageProfessionalName') {
        validateMessageProfessionalName(inputs.messageProfessionalName.value);
      }
      curTouched[field] = true;
      return curTouched;
    });
  };

  const submitHandler = async () => {
    if (
      Object.values(errors).some((value) => value !== undefined) ||
      !validateReferPronoun(inputs.referPronoun.value) ||
      !validateMessageProfessionalName(inputs.messageProfessionalName.value)
    ) {
      return;
    }

    setIsLoading(true);

    const request = { ...accountSettingsFromServer } as unknown as UpdateAccountSettingsRequest;
    request.referPronoun = inputs.referPronoun.value;
    request.messageProfessionalName = inputs.messageProfessionalName.value;

    try {
      const response = await updateAccountSettings(authCtx.token?.access_token!, request);
      if (response.ok) {
        if (!authCtx.userInfo?.userCreationCompleted) {
          navigation.navigate('PlanInfo');
        } else {
          setVisibleSnackbar(true);
          setTimeout(() => {
            setVisibleSnackbar(false);
          }, 5000);
        }
      } else {
        asyncErrorHandler(
          new Error(`MessagesSettings.submitHandler - else: ${JSON.stringify(response)}`, {
            cause: response.httpStatusCode
          })
        );
      }
    } catch (error: any) {
      asyncErrorHandler(
        new Error(`MessagesSettings.submitHandler - catch: ${JSON.stringify(error)}`, {
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
            referPronoun: {
              value: getAccountSettingsResponse.referPronoun,
              isValid: true
            },
            messageProfessionalName: {
              value: getAccountSettingsResponse.messageProfessionalName,
              isValid: true
            }
          });
        } else {
          asyncErrorHandler(
            new Error(
              `MessagesSettings.getAccountSettingsAsync - else: ${JSON.stringify(response)}`,
              {
                cause: response.httpStatusCode
              }
            )
          );
        }
      } catch (error: any) {
        asyncErrorHandler(
          new Error(`MessagesSettings.getAccountSettingsAsync - catch: ${JSON.stringify(error)}`, {
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
          field="referPronoun"
          label="Como deseja ser referenciada(o) nas mensagens:"
          keyboardType="default"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          textContentType="namePrefix"
          placeholder="Dra., Dr., etc..."
        />

        <Input
          field="messageProfessionalName"
          label="Seu nome nas mensagens:"
          keyboardType="default"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          onBlurHandler={handleBlur}
          textContentType="namePrefix"
          placeholder={accountSettingsFromServer?.username}
        />

        <View style={{ marginVertical: 20, paddingHorizontal: 5 }}>
          <Text style={{ fontSize: 18, color: Colors.primary500 }}>Prévia da mensagem:</Text>
        </View>

        <ImageBackground
          style={[styles.backgroundImg, { paddingVertical: 20 }]}
          source={require(whatsappBackgroundImg)}
          resizeMode="cover"
        >
          <View
            style={{
              ...styles.messageContainer,
              alignSelf: 'flex-end',
              backgroundColor: '#dfffc7',
              borderTopLeftRadius: 5,
              borderTopRightRadius: 5
            }}
          >
            {/* <View
              style={{
                ...styles.leftMessageArrow,
                display: true ? 'flex' : 'none'
              }}
            ></View> */}
            <Text
              style={{
                ...styles.messageText,
                left: 0
              }}
            >
              <View style={{ flexDirection: 'column' }}>
                <View>
                  <Text style={{ fontWeight: 'bold' }}>Olá João</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ flexWrap: 'wrap' }}>Passando para lembrar que</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ flexWrap: 'wrap' }}>você possui um agendamento</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ flexWrap: 'wrap' }}>
                    com {inputs.referPronoun.value ? inputs.referPronoun.value : ''}{' '}
                    {inputs.messageProfessionalName.value
                      ? inputs.messageProfessionalName.value
                      : accountSettingsFromServer?.username}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ flexWrap: 'wrap' }}>
                    no dia <Text style={{ fontWeight: 'bold' }}>01/01/2024 às 13:00</Text>.
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', marginVertical: 20 }}>
                  <Text style={{ flexWrap: 'wrap' }}>Você confirma sua presença?</Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ flexWrap: 'wrap' }}>Para confirmar o agendamento</Text>
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ flexWrap: 'wrap' }}>responda SIM ou NÂO.</Text>
                </View>
              </View>
            </Text>
            <View
              style={{
                ...styles.timeAndReadContainer,
                left: 0
              }}
            >
              <Text style={styles.timeText}>{'12:00 PM'}</Text>
              <View>
                <MaterialCommunityIcons name="read" size={16} color="#5bb6c9" />
              </View>
              <View
                style={{
                  ...styles.rightMsgArrow,
                  display: 'flex'
                }}
              ></View>
            </View>
          </View>
        </ImageBackground>
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

export default MessagesSettings;

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
  buttonTextStyles: { fontSize: 20 },
  messageContainer: {
    width: '65%',
    marginVertical: 3,
    marginHorizontal: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    flexDirection: 'row',
    borderRadius: 5
  },
  leftMessageArrow: {
    height: 0,
    width: 0,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderTopColor: Colors.light.white,
    borderTopWidth: 10,
    alignSelf: 'flex-start',
    borderRightColor: 'black',
    right: 10,
    bottom: 10
  },
  messageText: {
    fontSize: 16,
    width: '65%'
  },
  timeAndReadContainer: {
    flexDirection: 'row'
  },
  timeText: {
    fontSize: 12,
    color: Colors.light.grey
  },
  rightMsgArrow: {
    height: 0,
    width: 0,
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderTopColor: Colors.light.msgGreen,
    borderTopWidth: 10,
    alignSelf: 'flex-start',
    left: 6,
    bottom: 10
  },
  backgroundImg: {
    flex: 1
  }
});
