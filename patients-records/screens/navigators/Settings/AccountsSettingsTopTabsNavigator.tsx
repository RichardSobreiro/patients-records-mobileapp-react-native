/* eslint-disable import/order */
import { Colors } from '../../../constants/styles';
import AccountSettingsScreen from '../../../screens/Settings/Account/AccountSettingsScreen';
import AddressSettingsScreen from '../../../screens/Settings/Account/AddressSettingsScreen';
import ContactsSettingsScreen from '../../../screens/Settings/Account/ContactsSettingsScreen';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';

export type AccountsSettingsTopTabsParamsList = {
  AccountSettingsScreen;
  AddressSettingsScreen;
  ContactsSettingsScreen;
};

const TopTab = createMaterialTopTabNavigator<AccountsSettingsTopTabsParamsList>();

const AccountSettingsTopTabs = ({ route, navigation }) => {
  return (
    <TopTab.Navigator
      id="AccountSettingsTopTab"
      sceneContainerStyle={{ backgroundColor: Colors.primary100 }}
      screenOptions={{
        tabBarStyle: { backgroundColor: Colors.primary100 },
        tabBarLabelStyle: { color: Colors.tertiary800 },
        tabBarActiveTintColor: Colors.primary800
      }}
    >
      <TopTab.Screen
        name="AccountSettingsScreen"
        component={AccountSettingsScreen}
        options={{
          tabBarLabel: 'Dados da Conta'
        }}
      />
      <TopTab.Screen
        name="AddressSettingsScreen"
        component={AddressSettingsScreen}
        options={{
          tabBarLabel: 'Endereço'
        }}
      />
      <TopTab.Screen
        name="ContactsSettingsScreen"
        component={ContactsSettingsScreen}
        options={{
          tabBarLabel: 'Contatos'
        }}
      />
    </TopTab.Navigator>
  );
};

export default AccountSettingsTopTabs;
