/* eslint-disable import/order */
import PaymentsSettingsScreen from '../../../components/settings/plan/PaymentsSettingsScreen';
import PlanPaymentSettingsScreen from '../../../components/settings/plan/PlanPaymentSettingsScreen';
import PlanSettingsScreen from '../../../components/settings/plan/PlanSettings';
import { Colors } from '../../../constants/styles';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';

export type PaymentsPlanSettingsTopTabsPamsList = {
  PlanSettingsScreen;
  PaymentsSettingsScreen;
  PlanPaymentSettingsScreen;
};

const PaymentsPlanTopTabs = createMaterialTopTabNavigator<PaymentsPlanSettingsTopTabsPamsList>();

const PaymentsPlanSettingsTopTabs = ({ route, navigation }) => {
  return (
    <PaymentsPlanTopTabs.Navigator
      id="PaymentsPlanSettingsTopTabsNavigator"
      sceneContainerStyle={{ backgroundColor: Colors.primary100 }}
      screenOptions={{
        tabBarStyle: { backgroundColor: Colors.primary100 },
        tabBarLabelStyle: { color: Colors.tertiary800 },
        tabBarActiveTintColor: Colors.primary800
      }}
    >
      {/* <PaymentsPlanTopTabs.Screen
        name="PlanSettingsScreen"
        component={PlanSettingsScreen}
        options={{
          tabBarLabel: 'Plano'
        }}
      />
      <PaymentsPlanTopTabs.Screen
        name="PaymentsSettingsScreen"
        component={PaymentsSettingsScreen}
        options={{
          tabBarLabel: 'Pagamento'
        }}
      /> */}
      <PaymentsPlanTopTabs.Screen
        name="PlanPaymentSettingsScreen"
        component={PlanPaymentSettingsScreen}
        options={{
          tabBarLabel: 'Plano e Pagamento'
        }}
      />
    </PaymentsPlanTopTabs.Navigator>
  );
};

export default PaymentsPlanSettingsTopTabs;
