import Plans from '../../../constants/enums/Plans';
import { Colors } from '../../../constants/styles';
import useAsyncErrorHandler from '../../../hooks/useAsyncErrorHandler';
import { getAccountSettings, updateAccountSettings } from '../../../http/SettingsApi';
import GetAccountSettingsResponse from '../../../models/settings/accounts/GetAccountSettingsResponse';
import UpdateAccountSettingsRequest from '../../../models/settings/accounts/UpdateAccountSettingsRequest';
import { AuthContext } from '../../../store/auth-context';
import Button, { ButtonTypes } from '../../ui/Button';

import { Feather } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RadioButton, Snackbar } from 'react-native-paper';

type Props = {
  navigation: any;
};

const PlanSettings: React.FC<Props> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const asyncErrorHandler = useAsyncErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accountSettingsFromServer, setAccountSettingsFromServer] = useState<
    GetAccountSettingsResponse | undefined
  >(undefined);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const isFocused = useIsFocused();

  const [plan, setPlan] = useState<Plans>(Plans.Monthly);

  const submitHandler = async () => {
    if (plan === null || plan === undefined || plan.trim() === '') {
      return;
    }

    setIsLoading(true);

    const request = { ...accountSettingsFromServer } as unknown as UpdateAccountSettingsRequest;
    request.userPlanId = plan;

    try {
      const response = await updateAccountSettings(authCtx.token?.access_token!, request);
      if (response.ok) {
        if (!authCtx.userInfo?.userCreationCompleted) {
          navigation.navigate('CreateFirstPayment');
        } else {
          setVisibleSnackbar(true);
          setTimeout(() => {
            setVisibleSnackbar(false);
          }, 5000);
        }
      } else {
        asyncErrorHandler(
          new Error(`PlanSettings.submitHandler - else: ${JSON.stringify(response)}`, {
            cause: response.httpStatusCode
          })
        );
      }
    } catch (error: any) {
      asyncErrorHandler(
        new Error(`PlanSettings.submitHandler - catch: ${JSON.stringify(error)}`, {
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
          setPlan((getAccountSettingsResponse.userPlanId as Plans) ?? Plans.Monthly);
        } else {
          asyncErrorHandler(
            new Error(`PlanSettings.getAccountSettingsAsync - else: ${JSON.stringify(response)}`, {
              cause: response.httpStatusCode
            })
          );
        }
      } catch (error: any) {
        asyncErrorHandler(
          new Error(`PlanSettings.getAccountSettingsAsync - catch: ${JSON.stringify(error)}`, {
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

      <View style={{ marginVertical: 20, paddingLeft: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.primary500 }}>
          Selecione seu plano:
        </Text>
      </View>

      <ScrollView horizontal contentContainerStyle={{ flex: 1, flexDirection: 'column' }}>
        <View
          style={{
            borderBottomColor: Colors.primary500,
            borderBottomWidth: 1,
            borderTopColor: Colors.primary500,
            borderTopWidth: 1
          }}
        >
          <View style={{ flexDirection: 'row', minHeight: 50 }}>
            <View style={{ borderLeftWidth: 1, borderLeftColor: Colors.primary500, flex: 1 }}>
              <Text style={{ color: Colors.primary500, fontSize: 18 }}></Text>
            </View>
            <View
              style={{
                borderLeftWidth: 1,
                borderLeftColor: Colors.primary500,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text style={{ color: Colors.primary500, fontSize: 18 }}>7 Dias Grátis</Text>
            </View>

            <View
              style={{
                borderLeftWidth: 1,
                borderLeftColor: Colors.primary500,
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Text style={{ color: Colors.primary500, fontSize: 18, fontWeight: 'bold' }}>
                Mensal
              </Text>
            </View>
          </View>
        </View>

        <View
          style={{
            borderBottomColor: Colors.primary500,
            borderBottomWidth: 1,
            flexDirection: 'row',
            minHeight: 50
          }}
        >
          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ color: Colors.primary500, fontSize: 18, fontWeight: 'bold' }}>
              Plano Selecionado:
            </Text>
          </View>
          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RadioButton
              value="1"
              status={plan === '1' ? 'checked' : 'unchecked'}
              onPress={() => setPlan(Plans.Testing)}
            />
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <RadioButton
              value="3"
              status={plan === Plans.Monthly ? 'checked' : 'unchecked'}
              onPress={() => setPlan(Plans.Monthly)}
            />
          </View>
        </View>

        <View
          style={{
            borderBottomColor: Colors.primary500,
            borderBottomWidth: 1,
            flexDirection: 'row',
            minHeight: 50
          }}
        >
          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ color: Colors.primary500, fontSize: 16 }}>Lembretes por Whatsapp</Text>
          </View>
          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather name="check-circle" size={24} color="green" />
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather name="check-circle" size={24} color="green" />
          </View>
        </View>

        <View
          style={{
            borderBottomColor: Colors.primary500,
            borderBottomWidth: 1,
            flexDirection: 'row',
            minHeight: 50
          }}
        >
          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ color: Colors.primary500, fontSize: 16 }}>Prontuário eletrônico</Text>
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather name="check-circle" size={24} color="green" />
          </View>
          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather name="check-circle" size={24} color="green" />
          </View>
        </View>

        <View
          style={{
            borderBottomColor: Colors.primary500,
            borderBottomWidth: 1,
            flexDirection: 'row',
            minHeight: 50
          }}
        >
          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ color: Colors.primary500, fontSize: 16 }}>Agenda online</Text>
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather name="check-circle" size={24} color="green" />
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather name="check-circle" size={24} color="green" />
          </View>
        </View>

        <View
          style={{
            borderBottomColor: Colors.primary500,
            borderBottomWidth: 1,
            flexDirection: 'row',
            minHeight: 50
          }}
        >
          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ color: Colors.primary500, fontSize: 16 }}>Gestão financeira</Text>
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather name="check-circle" size={24} color="green" />
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather name="check-circle" size={24} color="green" />
          </View>
        </View>

        <View
          style={{
            borderBottomColor: Colors.primary500,
            borderBottomWidth: 1,
            flexDirection: 'row',
            minHeight: 50
          }}
        >
          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ color: Colors.primary500, fontSize: 16 }}>Relatórios</Text>
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather name="check-circle" size={24} color="green" />
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather name="check-circle" size={24} color="green" />
          </View>
        </View>

        <View
          style={{
            borderBottomColor: Colors.primary500,
            borderBottomWidth: 1,
            flexDirection: 'row',
            minHeight: 50
          }}
        >
          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ color: Colors.primary500, fontSize: 16 }}>Anamneses personalizadas</Text>
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather name="check-circle" size={24} color="green" />
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Feather name="check-circle" size={24} color="green" />
          </View>
        </View>

        <View
          style={{
            borderBottomColor: Colors.primary500,
            borderBottomWidth: 1,
            flexDirection: 'row',
            minHeight: 50
          }}
        >
          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ color: Colors.primary500, fontSize: 16, fontWeight: 'bold' }}>
              Valor:
            </Text>
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ color: Colors.primary500, fontSize: 16, fontWeight: 'bold' }}>R$ 0</Text>
          </View>

          <View
            style={{
              borderLeftWidth: 1,
              borderLeftColor: Colors.primary500,
              flex: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Text style={{ color: Colors.primary500, fontSize: 16, fontWeight: 'bold' }}>
              R$ 19,90
            </Text>
          </View>
        </View>

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
      </ScrollView>
    </>
  );
};

export default PlanSettings;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    marginBottom: 30,
    marginTop: 15,
    marginRight: 20
  },
  buttonPressable: {
    flex: 1,
    marginHorizontal: 3,
    minHeight: 40
  },
  buttonTextStyles: { fontSize: 20 }
});
