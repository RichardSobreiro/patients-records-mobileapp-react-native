/* eslint-disable import/order */
import 'react-native-gesture-handler';

import { Colors } from './constants/styles';
import LoginMainStack from './screens/Login/LoginMain';
import MainDrawerNavigatorComp from './screens/navigators/MainDrawerNavigator';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import AxiosContextProvider from './store/axios-context';
import NotificationProvider from './store/notification-context';

import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import React, { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, LogBox, SafeAreaView, StyleSheet } from 'react-native';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { pt, registerTranslation } from 'react-native-paper-dates';

registerTranslation('pt', pt);

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

WebBrowser.maybeCompleteAuthSession();

const Navigation = () => {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <LoginMainStack />}
      {authCtx.isAuthenticated && <MainDrawerNavigatorComp />}
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
