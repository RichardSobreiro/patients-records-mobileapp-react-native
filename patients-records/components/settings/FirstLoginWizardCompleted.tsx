import Button, { ButtonTypes } from '../../components/ui/Button';
import { Colors } from '../../constants/styles';
import useAsyncErrorHandler from '../../hooks/useAsyncErrorHandler';
import { getAccountSettings } from '../../http/SettingsApi';
import GetAccountSettingsResponse from '../../models/settings/accounts/GetAccountSettingsResponse';
import { AuthContext } from '../../store/auth-context';

import { useIsFocused } from '@react-navigation/native';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

type Props = {
  navigation: any;
};

const FirstLoginWizardCompleted: React.FC<Props> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);
  const asyncErrorHandler = useAsyncErrorHandler();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [accountSettingsFromServer, setAccountSettingsFromServer] = useState<
    GetAccountSettingsResponse | undefined
  >(undefined);
  const isFocused = useIsFocused();

  const submitHandler = async () => {};

  useEffect(() => {
    const getAccountSettingsAsync = async () => {
      setIsLoading(true);

      try {
        const response = await getAccountSettings(authCtx.token?.access_token!);
        if (response.ok) {
          const getAccountSettingsResponse = response.body as GetAccountSettingsResponse;
          setAccountSettingsFromServer(getAccountSettingsResponse);
        } else {
          asyncErrorHandler(
            new Error(
              `FirstLoginWizardCompleted.getAccountSettingsAsync - else: ${JSON.stringify(
                response
              )}`,
              {
                cause: response.httpStatusCode
              }
            )
          );
        }
      } catch (error: any) {
        asyncErrorHandler(
          new Error(
            `FirstLoginWizardCompleted.getAccountSettingsAsync - catch: ${JSON.stringify(error)}`,
            {
              cause: error.message
            }
          )
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

      <View style={{ marginVertical: 20, paddingLeft: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.primary500 }}>
          Tudo certo com o seu cadastro.
        </Text>
      </View>

      <ScrollView horizontal contentContainerStyle={{ flex: 1, flexDirection: 'column' }}>
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

export default FirstLoginWizardCompleted;

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
