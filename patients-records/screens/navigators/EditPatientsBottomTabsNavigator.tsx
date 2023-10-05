/* eslint-disable import/order */
import { Colors } from '../../constants/styles';
import EditCustomerScreen from '../Patients/EditCustomerScreen';
import AnamnesisCrudStackComp from './AnamnesisStackNavigator';
import ServicesCrudStackComp from './ServicesStackNavigator';

import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useEffect } from 'react';

export type EditPatientStackParamList = {
  PatientInfo: { customerId: string };
  ServicesCrud: { customerId: string };
  AnamnesisCrud: { customerId: string };
};

const Tab = createBottomTabNavigator<EditPatientStackParamList>();

const EditPatientBottomTabs = ({ route, navigation }) => {
  const { customerId, customerName } = route.params;

  useEffect(() => {
    navigation.setOptions({
      title: `Paciente: ${customerName}`,
      headerShown: true
    });
  }, [customerName, navigation]);

  return (
    <Tab.Navigator
      id="PatientsBottomTab"
      screenOptions={{ headerShown: false }}
      sceneContainerStyle={{ backgroundColor: Colors.primary100 }}
    >
      <Tab.Screen
        name="PatientInfo"
        component={EditCustomerScreen}
        initialParams={{ customerId }}
        options={{
          tabBarLabel: 'Dados Pessoais',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="address-book-o" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="ServicesCrud"
        component={ServicesCrudStackComp}
        initialParams={{ customerId }}
        options={{
          tabBarLabel: 'Atendimentos',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="hand-holding-medical" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="AnamnesisCrud"
        component={AnamnesisCrudStackComp}
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

export default EditPatientBottomTabs;
