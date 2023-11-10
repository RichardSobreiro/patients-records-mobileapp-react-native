/* eslint-disable import/order */
import { Colors } from '../../../constants/styles';
import AccountSettingsTopTabs from './AccountsSettingsTopTabsNavigator';
import PaymentsPlanSettingsTopTabs from './PaymentsPlanSettingsTopTabs';

import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';

export type SettingsBottomTabsParamList = {
  AccountSettings;
  MessagesSettings;
  PaymentsPlanSettings;
};

const Tab = createBottomTabNavigator<SettingsBottomTabsParamList>();

const SettingsBottomTabs = ({ route, navigation }) => {
  return (
    <Tab.Navigator
      id="SettingsBottomTab"
      screenOptions={{ headerShown: false }}
      sceneContainerStyle={{ backgroundColor: Colors.primary500 }}
    >
      <Tab.Screen
        name="AccountSettings"
        component={AccountSettingsTopTabs}
        options={{
          tabBarLabel: 'Usuário',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="address-book-o" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen
        name="PaymentsPlanSettings"
        component={PaymentsPlanSettingsTopTabs}
        options={{
          tabBarLabel: 'Pagamento e Planos',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="money-check-alt" size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
};

export default SettingsBottomTabs;
