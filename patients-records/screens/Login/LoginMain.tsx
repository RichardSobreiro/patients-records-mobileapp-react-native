import { Colors } from '../../constants/styles';
import LoginScreen from '../LoginScreen';
import SignupScreen from '../SignupScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type LogintStackParamList = {
  Login: undefined;
  Signup: undefined;
};

const Stack = createNativeStackNavigator<LogintStackParamList>();

const LoginMainStack = () => {
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

export default LoginMainStack;
