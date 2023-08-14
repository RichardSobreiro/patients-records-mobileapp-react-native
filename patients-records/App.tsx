import IconButton from './components/ui/IconButton';
import CreateEditProceedingTopTabs from './components/ui/navigations/CreateEditProceedingTopTabs';
import { Colors } from './constants/styles';
import LoginScreen from './screens/LoginScreen';
import PatientScreen from './screens/PatientScreen';
import ProceedingsListScreen from './screens/ProceedingsListScreen';
import SignupScreen from './screens/SignupScreen';
import WelcomeScreen from './screens/WelcomeScreen';
import AuthContextProvider, { AuthContext } from './store/auth-context';
import AxiosContextProvider from './store/axios-context';
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
  PatientInfo: { patientId: string };
  ProceedingsList: { patient: GetCustomer; refresh?: boolean };
  CreateProceeding: { patient: GetCustomer };
  EditProceeding: { patient: GetCustomer; proceeding: GetProceedingResponse };
};

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Welcome: { shouldUpdatePatientsList?: boolean };
  CreatePatient: { patientId?: string };
  EditPatient: { patientId: string; patient?: GetCustomer; shouldUpdatePatientsList?: boolean };
};

const Tab = createBottomTabNavigator<EditPatientStackParamList>();

const EditPatientBottomTabs = ({ route, navigation }) => {
  const { patientId, patient, refresh, shouldUpdatePatientsList } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: 'Atualizando Paciente'
    });
  });

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="PatientInfo"
        component={PatientScreen}
        initialParams={{ patientId }}
        options={{
          tabBarLabel: 'Informações Básicas',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="address-book-o" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="ProceedingsList"
        component={ProceedingsListScreen}
        initialParams={{ patient, refresh }}
        options={{
          tabBarLabel: 'Procedimentos',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="book-medical" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="CreateProceeding"
        component={CreateEditProceedingTopTabs}
        initialParams={{ patient }}
        options={{
          tabBarLabel: 'Novo Procedimento',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="plus-square" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="EditProceeding"
        component={CreateEditProceedingTopTabs}
        initialParams={{ patient }}
        options={{
          tabBarIconStyle: { display: 'none' },
          tabBarButton: () => null
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
        name="CreatePatient"
        component={PatientScreen}
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
              <Root />
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
