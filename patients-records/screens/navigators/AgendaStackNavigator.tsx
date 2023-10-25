import { Colors } from '../../constants/styles';
import AgendaHomeScreen from '../Agenda/AgendaHomeScreen';
import PatientsListScreen from '../Patients/PatientsListScreen';
import CreateServiceScreen from '../Patients/ServicesScreens/CreateServiceScreen';
import CreateServiceTypeScreen from '../Patients/ServicesScreens/CreateServiceTypeScreen';
import EditServiceScreen from '../Patients/ServicesScreens/EditServiceScreen';
import EditServiceTypeScreen from '../Patients/ServicesScreens/EditServiceTypeScreen';

import { AntDesign } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';

export type AgendaStackParamList = {
  AgendaHome;
  CreateService: { customerId: string };
  EditService: { customerId: string; serviceId: string; showCreatedSnackbar?: boolean };
  PatientsList;
  EditServiceType: { serviceTypeId: string; showCreatedSnackbar?: boolean };
  CreateServiceType;
};

const StackAgenda = createNativeStackNavigator<AgendaStackParamList>();

const AgendaStackCompScreen = ({ route, navigation }) => {
  const customerId = route.params !== undefined ? route.params.customerId : '';
  const serviceId = route.params !== undefined ? route.params.serviceId : '';
  const serviceTypeId = route.params !== undefined ? route.params.serviceTypeId : '';

  return (
    <StackAgenda.Navigator
      id="AgendaStackNavigator"
      screenOptions={{
        contentStyle: { backgroundColor: 'transparent' }
      }}
    >
      <StackAgenda.Screen
        name="AgendaHome"
        component={AgendaHomeScreen}
        options={{
          headerShown: false
        }}
      />
      <StackAgenda.Screen
        name="CreateService"
        component={CreateServiceScreen}
        initialParams={{ customerId }}
        options={{
          contentStyle: { backgroundColor: Colors.primary100 },
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity>
              <AntDesign
                style={{ paddingLeft: 0, paddingRight: 30 }}
                name="arrowleft"
                size={24}
                color={Colors.primary500}
                onPress={() => {
                  navigation.setOptions({
                    headerShown: false
                  });
                  navigation.goBack();
                }}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: Colors.primary100
          },
          headerShadowVisible: false
        }}
      />
      <StackAgenda.Screen
        name="EditService"
        component={EditServiceScreen}
        initialParams={{ customerId, serviceId }}
        options={{
          contentStyle: { backgroundColor: Colors.primary100 },
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity>
              <AntDesign
                style={{ paddingLeft: 0, paddingRight: 30 }}
                name="arrowleft"
                size={24}
                color={Colors.primary500}
                onPress={() => {
                  navigation.setOptions({
                    headerShown: false
                  });
                  navigation.navigate('AgendaHome');
                }}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: Colors.primary100
          },
          headerShadowVisible: false
        }}
      />
      <StackAgenda.Group screenOptions={{ presentation: 'modal' }}>
        <StackAgenda.Screen
          name="PatientsList"
          component={PatientsListScreen}
          options={{
            contentStyle: { backgroundColor: Colors.primary100 },
            headerTitle: 'Selecione o Paciente:',
            headerTitleStyle: {
              color: Colors.primary500
            },
            headerLeft: () => (
              <TouchableOpacity>
                <AntDesign
                  style={{ paddingLeft: 0, paddingRight: 30 }}
                  name="arrowleft"
                  size={24}
                  color={Colors.primary500}
                  onPress={() => {
                    navigation.setOptions({
                      headerShown: false
                    });
                    navigation.navigate('AgendaHome');
                  }}
                />
              </TouchableOpacity>
            ),
            headerStyle: {
              backgroundColor: Colors.primary100
            },
            headerShadowVisible: false
          }}
        />
        <StackAgenda.Screen
          name="CreateServiceType"
          component={CreateServiceTypeScreen}
          options={{
            contentStyle: { backgroundColor: Colors.primary100 },
            headerTitle: '',
            headerTitleStyle: {
              color: Colors.primary500
            },
            headerStyle: {
              backgroundColor: Colors.primary100
            },
            headerShadowVisible: false
          }}
        />
        <StackAgenda.Screen
          name="EditServiceType"
          component={EditServiceTypeScreen}
          initialParams={{ serviceTypeId }}
          options={{
            contentStyle: { backgroundColor: Colors.primary100 },
            headerTitle: '',
            headerStyle: {
              backgroundColor: Colors.primary100
            },
            headerShadowVisible: false
          }}
        />
      </StackAgenda.Group>
    </StackAgenda.Navigator>
  );
};

export default AgendaStackCompScreen;
