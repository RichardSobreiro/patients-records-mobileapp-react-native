import { Colors } from '../../constants/styles';
import LoginScreen from '../Login/LoginScreen';
import SignupStackNavigator from './SignupStackNavigator';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type LogintStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<LogintStackParamList>();

const LoginMainStackNavigator = () => {
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
        component={SignupStackNavigator}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};

export default LoginMainStackNavigator;
