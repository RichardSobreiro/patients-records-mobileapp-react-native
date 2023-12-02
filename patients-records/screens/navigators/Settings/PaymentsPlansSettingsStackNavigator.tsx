/* eslint-disable import/order */
import PlanSettingsScreen from '../../../components/settings/plan/PlanSettings';
import { Colors } from '../../../constants/styles';
import CreatePaymentMethodScreen from '../../../screens/Settings/Payments/Methods/CreatePaymentMethodScreen';
import EditPaymentMethodScreen from '../../../screens/Settings/Payments/Methods/EditPaymentMethodScreen';
import PaymentMethodsListScreen from '../../../screens/Settings/Payments/Methods/PaymentMethodsListScreen';
import PaymentInstalmentsEditScreen from '../../Settings/Payments/PaymentInstalmentsEditScreen';
import PaymentsSettingsScreen from '../../Settings/Payments/PaymentsSettingsScreen';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React, { useLayoutEffect } from 'react';

export type PaymentsStack = {
  PaymentInstalmentsEdit;
  PaymentsPlansSettingsScreen;
  PaymentsMethodsListScreen;
  CreatePaymentMethodScreen;
  EditPaymentMethodScreen;
};

export type PaymentsPlanSettingsTopTabsPamsList = {
  PlanSettingsScreen;
  PaymentsSettingsScreen;
  PaymentInstalmentsEdit;
};

const PaymentsPlansSettingsStack = createNativeStackNavigator<PaymentsStack>();

const PaymentsPlanTopTabs = createMaterialTopTabNavigator<PaymentsPlanSettingsTopTabsPamsList>();

const PaymentsPlanSettingsTopTabs = ({ route, navigation }) => {
  useLayoutEffect(() => {
    if (!navigation) return;

    const paymentsPlansSettingsStackNavigator = navigation.getParent(
      'PaymentsPlansSettingsStackNavigator'
    );
    if (paymentsPlansSettingsStackNavigator) {
      paymentsPlansSettingsStackNavigator.setOptions({
        headerShown: false
      });
    }

    return () => {
      paymentsPlansSettingsStackNavigator?.setOptions({
        headerShown: true
      });
    };
  }, [navigation]);

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
      <PaymentsPlanTopTabs.Screen
        name="PaymentsSettingsScreen"
        component={PaymentsSettingsScreen}
        options={{
          tabBarLabel: 'Pagamento'
        }}
      />
      <PaymentsPlanTopTabs.Screen
        name="PlanSettingsScreen"
        component={PlanSettingsScreen}
        options={{
          tabBarLabel: 'Plano'
        }}
      />
    </PaymentsPlanTopTabs.Navigator>
  );
};

const PaymentsPlansSettingsStackNavigator = () => {
  return (
    <PaymentsPlansSettingsStack.Navigator
      id="PaymentsPlansSettingsStackNavigator"
      screenOptions={{
        contentStyle: { backgroundColor: Colors.primary100 },
        headerShown: true,
        headerStyle: { backgroundColor: Colors.primary100 },
        headerTitleStyle: { color: Colors.primary500 },
        headerTintColor: Colors.primary500
      }}
    >
      <PaymentsPlansSettingsStack.Group>
        <PaymentsPlansSettingsStack.Screen
          name="PaymentsPlansSettingsScreen"
          component={PaymentsPlanSettingsTopTabs}
        />
        <PaymentsPlansSettingsStack.Screen
          name="PaymentsMethodsListScreen"
          component={PaymentMethodsListScreen}
          options={{
            title: 'Meios de pagamento'
          }}
        />
        <PaymentsPlansSettingsStack.Screen
          name="CreatePaymentMethodScreen"
          component={CreatePaymentMethodScreen}
          options={{
            title: 'Substituir cartão de crédito'
          }}
        />
        <PaymentsPlansSettingsStack.Screen
          name="EditPaymentMethodScreen"
          component={EditPaymentMethodScreen}
          options={{
            title: 'Atualizando meio de pagamento'
          }}
        />
      </PaymentsPlansSettingsStack.Group>
      <PaymentsPlansSettingsStack.Group screenOptions={{ presentation: 'modal' }}>
        <PaymentsPlansSettingsStack.Screen
          name="PaymentInstalmentsEdit"
          component={PaymentInstalmentsEditScreen}
        />
      </PaymentsPlansSettingsStack.Group>
    </PaymentsPlansSettingsStack.Navigator>
  );
};

export default PaymentsPlansSettingsStackNavigator;
