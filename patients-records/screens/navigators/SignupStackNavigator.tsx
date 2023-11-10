/* eslint-disable import/order */
import { Colors } from '../../constants/styles';
import SignupScreen from '../Signup/SignupScreen';

import { AntDesign } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';

export type SignupStackParamList = {
  SignupData;
};

const SignupStack = createNativeStackNavigator<SignupStackParamList>();

const SignupStackNavigator = ({ route, navigation }) => {
  return (
    <SignupStack.Navigator
      id="SignupNavigator"
      screenOptions={{
        contentStyle: { backgroundColor: Colors.primary100 }
      }}
    >
      <SignupStack.Screen
        name="SignupData"
        component={SignupScreen}
        options={{
          headerShown: true,
          headerTitle: 'Dados de Acesso',
          headerTitleStyle: { color: 'white' },
          headerLeft: () => (
            <TouchableOpacity>
              <AntDesign
                style={{ paddingLeft: 0, paddingRight: 30 }}
                name="arrowleft"
                size={24}
                color={Colors.primary100}
                onPress={() => {
                  navigation.replace('Login');
                }}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: Colors.primary500
          }
        }}
      />
    </SignupStack.Navigator>
  );
};

export default SignupStackNavigator;
