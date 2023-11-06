/* eslint-disable import/order */
import 'react-native-gesture-handler';

import ErrorDialog from './components/ui/ErrorDialog';
import { Colors } from './constants/styles';
import LoginMainStack from './screens/Login/LoginMain';
import MainDrawerNavigatorComp from './screens/navigators/MainDrawerNavigator';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import AxiosContextProvider from './store/axios-context';
import NotificationProvider from './store/notification-context';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, LogBox, SafeAreaView, StyleSheet } from 'react-native';
import ErrorBoundary from 'react-native-error-boundary';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { pt, registerTranslation } from 'react-native-paper-dates';

registerTranslation('pt', pt);

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

WebBrowser.maybeCompleteAuthSession();

const handleJSErrors = (error: Error, stackTrace: string) => {
  // console.log(`ERROR HANDLER: ${JSON.stringify(error)}`);
  // console.log(`STACK TRACE: ${stackTrace}`);
};

const CustomFallback = (props: { error: Error; resetError: Function }) => {
  const [show, setShow] = useState<boolean>(true);
  const authCtx = useContext(AuthContext);
  if (props.error.cause === 401) {
    authCtx.logout();
    props.resetError();
  }
  return (
    <ErrorDialog
      show={show}
      hideNotification={() => {
        setShow(false);
        props.resetError();
      }}
      title={'Um Erro Inesperado Ocorreu'}
      message={'Não se preocupe. Esse problema já foi reportado para o nosso time de técnico.'}
    />
  );
};

const Navigation = () => {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      <ErrorBoundary onError={handleJSErrors} FallbackComponent={CustomFallback}>
        {!authCtx.isAuthenticated && <LoginMainStack />}
        {authCtx.isAuthenticated && <MainDrawerNavigatorComp />}
      </ErrorBoundary>
    </NavigationContainer>
  );
};

const Root = () => {
  const [isTryingLogin, setIsTryingLogin] = useState(true);

  const authCtx = useContext(AuthContext);

  useEffect(() => {
    async function initialSetup() {
      await authCtx.initializeState();
    }
    try {
      initialSetup();
    } catch (e: any) {
      console.log(e);
    } finally {
      setIsTryingLogin(false);
    }
  }, []);

  if (isTryingLogin) {
    return <ActivityIndicator size="large" />;
  }

  return <Navigation />;
};

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: Colors.primary500,
    secondary: Colors.secondary500,
    surface: Colors.primary100,
    onSurfaceVariant: Colors.primary500,
    onSecondaryContainer: Colors.primary500,
    onSurface: Colors.primary500,
    outline: Colors.primary500,
    surfaceDisabled: Colors.primary500,
    onSurfaceDisabled: Colors.primary500,
    secondaryContainer: Colors.secondary100
  }
};

const App: React.FC = () => {
  return (
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <AuthContextProvider>
          <AxiosContextProvider>
            <PaperProvider theme={theme}>
              <NotificationProvider>
                <Root />
              </NotificationProvider>
            </PaperProvider>
          </AxiosContextProvider>
        </AuthContextProvider>
      </SafeAreaView>
    </>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});
