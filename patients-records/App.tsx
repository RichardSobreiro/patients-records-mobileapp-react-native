import IconButton from './components/ui/IconButton';
import { Colors } from './constants/styles';
import AnamnesisListScreen from './screens/AnamnesisListScreen';
import CreateCustomerScreen from './screens/CreateCustomerScreen';
import EditCustomerScreen from './screens/EditCustomerScreen';
import LoginScreen from './screens/LoginScreen';
import ServicesListScreen from './screens/ServicesListScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import AxiosContextProvider from './store/axios-context';
import NotificationProvider from './store/notification-context';
import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import * as WebBrowser from 'expo-web-browser';
import { GetCustomer } from 'models/GetCustomersResponse';
import { GetProceedingResponse } from 'models/proceedings/GetProceedingResponse';
import { useContext, useEffect, useState } from 'react';
import { ActivityIndicator, LogBox, SafeAreaView, StyleSheet } from 'react-native';
import { DefaultTheme, PaperProvider } from 'react-native-paper';
import { pt, registerTranslation } from 'react-native-paper-dates';

registerTranslation('pt', pt);

LogBox.ignoreLogs(['Non-serializable values were found in the navigation state']);

WebBrowser.maybeCompleteAuthSession();

export type EditPatientStackParamList = {
  PatientInfo: { customerId: string };
  ServicesList: { customerId: string };
  AnamnesisList: { customerId: string };
  CreateProceeding: { patient: GetCustomer };
  EditProceeding: { patient: GetCustomer; proceeding: GetProceedingResponse };
};

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Welcome: { shouldUpdatePatientsList?: boolean };
  CreateCustomer: undefined;
  EditPatient: { customerId: string; shouldUpdatePatientsList?: boolean };
};

const Tab = createBottomTabNavigator<EditPatientStackParamList>();

const EditPatientBottomTabs = ({ route, navigation }) => {
  const { customerId } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: 'Atualizando Paciente'
    });
  });

  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      sceneContainerStyle={{ backgroundColor: Colors.primary100 }}
    >
      <Tab.Screen
        name="PatientInfo"
        component={EditCustomerScreen}
        initialParams={{ customerId }}
        options={{
          tabBarLabel: 'Informações Básicas',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="address-book-o" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="ServicesList"
        component={ServicesListScreen}
        initialParams={{ customerId }}
        options={{
          tabBarLabel: 'Atendimentos',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="hand-holding-medical" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="AnamnesisList"
        component={AnamnesisListScreen}
        initialParams={{ customerId }}
        options={{
          tabBarLabel: 'Anamneses',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="book-medical" size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AuthenticatedStack = () => {
  const authCtx = useContext(AuthContext);
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: '#ffffff',
        contentStyle: { backgroundColor: Colors.primary100 }
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{
          headerTitle: authCtx.userInfo?.username ?? 'Inicio',
          headerRight: ({ tintColor }) => (
            <IconButton icon="exit" color={tintColor} size={24} onPress={authCtx.logout} />
          )
        }}
      />
      <Stack.Screen
        name="CreateCustomer"
        component={CreateCustomerScreen}
        options={{
          headerTitle: authCtx.userInfo?.username ?? 'Inicio',
          headerRight: ({ tintColor }) => (
            <IconButton icon="exit" color={tintColor} size={24} onPress={authCtx.logout} />
          )
        }}
      />
      <Stack.Screen name="EditPatient" component={EditPatientBottomTabs} />
    </Stack.Navigator>
  );
};

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: '#ffffff',
        contentStyle: { backgroundColor: Colors.primary100 }
      }}
    >
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{
          headerTitle: 'Entrar'
        }}
      />
      <Stack.Screen
        name="Signup"
        component={SignupScreen}
        options={{
          headerTitle: 'Cadastro'
        }}
      />
    </Stack.Navigator>
  );
};

const Navigation = () => {
  const authCtx = useContext(AuthContext);

  return (
    <NavigationContainer>
      {!authCtx.isAuthenticated && <AuthStack />}
      {authCtx.isAuthenticated && <AuthenticatedStack />}
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
    onSurfaceVariant: Colors.primary500
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
