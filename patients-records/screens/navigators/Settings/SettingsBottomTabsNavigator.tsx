/* eslint-disable import/order */
import { Colors } from '../../../constants/styles';
import BusinessSettingsScreen from '../../../screens/Settings/Business/BusinessSettingsScreen';
import MessagesSettingsScreen from '../../../screens/Settings/Messages/MessagesSettingsScreen';
import AccountSettingsTopTabsNavigator from './AccountsSettingsTopTabsNavigator';
import PaymentsPlanSettingsTopTabs from './PaymentsPlanSettingsTopTabs';

import { FontAwesome, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

export type SettingsBottomTabsParamList = {
  AccountSettings;
  BusinessSettings;
  MessagesSettings;
  PaymentsPlanSettings;
};

const BottomTabs = createBottomTabNavigator<SettingsBottomTabsParamList>();

const SettingsBottomTabs = ({ route, navigation }) => {
  return (
    <BottomTabs.Navigator
      id="SettingsBottomTab"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.primary500,
        tabBarActiveBackgroundColor: Colors.primary100,
        tabBarInactiveBackgroundColor: Colors.primary100
      }}
      sceneContainerStyle={{ backgroundColor: Colors.primary100 }}
    >
      <BottomTabs.Screen
        name="AccountSettings"
        component={AccountSettingsTopTabsNavigator}
        options={{
          tabBarLabel: 'Usuário',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="address-book-o" size={size} color={color} />
          )
        }}
      />
      <BottomTabs.Screen
        name="BusinessSettings"
        component={BusinessSettingsScreen}
        options={{
          tabBarLabel: 'Sua Empresa',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="business-time" size={size} color={color} />
          )
        }}
      />
      <BottomTabs.Screen
        name="MessagesSettings"
        component={MessagesSettingsScreen}
        options={{
          tabBarLabel: 'Mensagens',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cellphone-message" size={size} color={color} />
          )
        }}
      />
      <BottomTabs.Screen
        name="PaymentsPlanSettings"
        component={PaymentsPlanSettingsTopTabs}
        options={{
          tabBarLabel: 'Pagamento e Planos',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="money-check-alt" size={size} color={color} />
          )
        }}
      />
    </BottomTabs.Navigator>
  );
};

export default SettingsBottomTabs;
