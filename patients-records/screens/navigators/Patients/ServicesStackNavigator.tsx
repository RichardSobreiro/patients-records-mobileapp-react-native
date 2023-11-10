/* eslint-disable import/order */
import { Colors } from '../../../constants/styles';
import CreateServiceScreen from '../../Patients/ServicesScreens/CreateServiceScreen';
import CreateServiceTypeScreen from '../../Patients/ServicesScreens/CreateServiceTypeScreen';
import EditServiceScreen from '../../Patients/ServicesScreens/EditServiceScreen';
import EditServiceTypeScreen from '../../Patients/ServicesScreens/EditServiceTypeScreen';
import ServicesListScreen from '../../Patients/ServicesScreens/ServicesListScreen';

import { AntDesign } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity } from 'react-native';

export type RootStackServicesCrudParamList = {
  ServicesList: { customerId: string; updateList?: boolean };
  CreateService: { customerId: string };
  EditService: { customerId: string; serviceId: string; showCreatedSnackbar?: boolean };
  EditServiceType: { serviceTypeId: string; showCreatedSnackbar?: boolean };
  CreateServiceType;
};

const StackServicesCrud = createNativeStackNavigator<RootStackServicesCrudParamList>();

const ServicesCrudStackComp = ({ route, navigation }) => {
  const { customerId, serviceId, serviceTypeId } = route.params;

  return (
    <StackServicesCrud.Navigator
      id="ServicesCrudNavigator"
      screenOptions={{
        contentStyle: { backgroundColor: Colors.primary100 }
      }}
    >
      <StackServicesCrud.Screen
        name="ServicesList"
        component={ServicesListScreen}
        initialParams={{ customerId }}
        options={{
          headerShown: false
        }}
      />
      <StackServicesCrud.Screen
        name="CreateService"
        component={CreateServiceScreen}
        initialParams={{ customerId }}
        options={{
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
                  navigation.replace('ServicesList', { customerId });
                }}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: 'transparent'
          },
          headerShadowVisible: false
        }}
      />
      <StackServicesCrud.Screen
        name="CreateServiceType"
        component={CreateServiceTypeScreen}
        options={{
          headerTitle: '',
          headerTitleStyle: {
            color: Colors.primary500
          },
          headerStyle: {
            backgroundColor: 'transparent'
          },
          headerShadowVisible: false
        }}
      />
      <StackServicesCrud.Screen
        name="EditServiceType"
        component={EditServiceTypeScreen}
        initialParams={{ serviceTypeId }}
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: 'transparent'
          },
          headerShadowVisible: false
        }}
      />
      <StackServicesCrud.Screen
        name="EditService"
        component={EditServiceScreen}
        initialParams={{ customerId, serviceId }}
        options={{
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
                  navigation.replace('ServicesList', { customerId });
                }}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: 'transparent'
          },
          headerShadowVisible: false
        }}
      />
    </StackServicesCrud.Navigator>
  );
};

export default ServicesCrudStackComp;
