import { Colors } from '../../../constants/styles';
import useAsyncErrorHandler from '../../../hooks/useAsyncErrorHandler';
import GetAccountSettingsResponse from '../../../models/settings/accounts/GetAccountSettingsResponse';
import { AuthContext } from '../../../store/auth-context';

import { Feather } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { RadioButton, SegmentedButtons, Snackbar } from 'react-native-paper';

type Props = {
  navigation: any;
};

const PaymentPlanSettingsScreen: React.FC<Props> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const asyncErrorHandler = useAsyncErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accountSettingsFromServer, setAccountSettingsFromServer] = useState<
    GetAccountSettingsResponse | undefined
  >(undefined);
  const [visibleSnackbar, setVisibleSnackbar] = useState(false);
  const [yPosition, setYPosition] = useState<number>(0);
  const isFocused = useIsFocused();
  const [step, setStep] = useState<string>('1');

  const [plan, setPlan] = useState<string>('2');

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
      <SegmentedButtons
        style={{ marginTop: 10, borderRadius: 0 }}
        theme={{
          colors: { secondaryContainer: Colors.primary500, onSecondaryContainer: Colors.primary100 }
        }}
        value={step}
        onValueChange={setStep}
        buttons={[
          {
            value: '1',
            label: 'Plano',
            showSelectedCheck: true,
            style: { borderRadius: 0 }
          },
          {
            value: '2',
            label: 'Pagamento',
            showSelectedCheck: true
          },
          {
            value: '3',
            label: 'Resumo',
            showSelectedCheck: true,
            style: { borderRadius: 0 }
          }
        ]}
      />

      {step === '1' && (
        <>
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
              <View style={{ flexDirection: 'row' }}>
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
                  <Text style={{ color: Colors.primary500, fontSize: 18 }}>Anual</Text>
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
                  <Text style={{ color: Colors.primary500, fontSize: 18 }}>Mensal</Text>
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
                <Text style={{ color: Colors.primary500, fontSize: 16, fontWeight: 'bold' }}>
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
                  onPress={() => setPlan('1')}
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
                  value="2"
                  status={plan === '2' ? 'checked' : 'unchecked'}
                  onPress={() => setPlan('2')}
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
                  status={plan === '3' ? 'checked' : 'unchecked'}
                  onPress={() => setPlan('3')}
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
                <Text style={{ color: Colors.primary500, fontSize: 14 }}>
                  Lembretes por Whatsapp
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
                <Text style={{ color: Colors.primary500, fontSize: 14 }}>
                  Prontuário eletrônico
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
                <Text style={{ color: Colors.primary500, fontSize: 14 }}>Agenda online</Text>
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
                <Text style={{ color: Colors.primary500, fontSize: 14 }}>Gestão financeira</Text>
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
                <Text style={{ color: Colors.primary500, fontSize: 14 }}>Relatórios</Text>
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
                <Text style={{ color: Colors.primary500, fontSize: 14 }}>
                  Anamneses personalizadas
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
                <Text style={{ color: Colors.primary500, fontSize: 16, fontWeight: 'bold' }}>
                  R$ 0
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
                <Text style={{ color: Colors.primary500, fontSize: 16, fontWeight: 'bold' }}>
                  R$ 240
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
                <Text style={{ color: Colors.primary500, fontSize: 16, fontWeight: 'bold' }}>
                  R$ 20
                </Text>
              </View>
            </View>
          </ScrollView>
        </>
      )}
    </>
  );
};

export default PaymentPlanSettingsScreen;
