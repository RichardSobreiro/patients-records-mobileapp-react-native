import IconButton from '../../components/ui/IconButton';
import { AuthContext } from '../../store/auth-context';
import EditPatientBottomTabs from '../navigators/EditPatientsBottomTabsNavigator';
import CreateCustomerScreen from './CreateCustomerScreen';
import PatientsListScreen from './PatientsListScreen';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useContext } from 'react';

import { Colors } from 'react-native/Libraries/NewAppScreen';

export type RootStackParamList = {
  PatientsList: { shouldUpdatePatientsList?: boolean };
  CreateCustomer: undefined;
  EditPatient: { customerId: string; customerName: string; shouldUpdatePatientsList?: boolean };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const PatientsHomeScreen = () => {
  const authCtx = useContext(AuthContext);
  return (
    <Stack.Navigator
      id="RootStack"
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: '#ffffff',
        contentStyle: { backgroundColor: Colors.primary100 }
      }}
    >
      <Stack.Screen
        name="PatientsList"
        component={PatientsListScreen}
        options={{
          headerTitle: 'Pacientes',
          headerRight: ({ tintColor }) => (
            <IconButton icon="exit" color={tintColor} size={24} onPress={authCtx.logout} />
          )
        }}
      />
      <Stack.Screen
        name="CreateCustomer"
        component={CreateCustomerScreen}
        options={{
          headerTitle: 'Incluir Paciente',
          headerRight: ({ tintColor }) => (
            <IconButton icon="exit" color={tintColor} size={24} onPress={authCtx.logout} />
          )
        }}
      />
      <Stack.Screen name="EditPatient" component={EditPatientBottomTabs} />
    </Stack.Navigator>
  );
};

export default PatientsHomeScreen;
