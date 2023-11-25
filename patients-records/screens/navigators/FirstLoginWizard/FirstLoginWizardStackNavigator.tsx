import { Colors } from '../../../constants/styles';
import BusinessSettingsScreen from '../../../screens/Settings/Business/BusinessSettingsScreen';
import FirstLoginWizardCompletedScreen from '../../../screens/Settings/FirstLoginWizardCompletedScreen';
import MessagesSettingsScreen from '../../../screens/Settings/Messages/MessagesSettingsScreen';
import PaymentInstalmentsEditScreen from '../../../screens/Settings/Payments/PaymentInstalmentsEditScreen';
import PlanSettingsScreen from '../../../screens/Settings/Plans/PlansSettingsScreen';
import CreateFirstPaymentScreen from '../../Settings/Payments/CreateFirstPaymentScreen';
import AccountSettingsTopTabsNavigator from '../Settings/AccountsSettingsTopTabsNavigator';

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useLayoutEffect } from 'react';

export type LogintStackParamList = {
  BasicUserInfo;
  BusinessInfo;
  MessageSettings;
  PlanInfo;
  CreateFirstPayment;
  FirstLoginWizardCompleted;
  PaymentInstalmentsEdit;
};

const Stack = createNativeStackNavigator<LogintStackParamList>();

const FirstLoginWizardStackNavigator = ({ navigation }) => {
  useLayoutEffect(() => {
    const mainDrawerNavigator = navigation.getParent('MainDrawerNavigator');
    if (mainDrawerNavigator) {
      mainDrawerNavigator.setOptions({
        headerShown: false
      });
    }

    return () => {
      mainDrawerNavigator.setOptions({
        headerShown: true
      });
    };
  });

  return (
    <Stack.Navigator
      id="FirstLoginWizardStackNavigator"
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary100 },
        headerTintColor: Colors.primary500,
        contentStyle: { backgroundColor: Colors.primary100 }
      }}
    >
      <Stack.Screen
        name="BasicUserInfo"
        component={AccountSettingsTopTabsNavigator}
        options={{
          headerTitle: 'Dados Básicos',
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen
        name="BusinessInfo"
        component={BusinessSettingsScreen}
        options={{
          headerTitle: 'Sua Empresa',
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen
        name="MessageSettings"
        component={MessagesSettingsScreen}
        options={{
          headerTitle: 'Configuração das Mensagens',
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen
        name="PlanInfo"
        component={PlanSettingsScreen}
        options={{
          headerTitle: 'Escolha seu Plano',
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen
        name="CreateFirstPayment"
        component={CreateFirstPaymentScreen}
        options={{
          headerTitle: 'Pagamento',
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen
        name="FirstLoginWizardCompleted"
        component={FirstLoginWizardCompletedScreen}
        options={{
          headerTitle: '',
          headerTitleAlign: 'center'
        }}
      />
      <Stack.Screen
        name="PaymentInstalmentsEdit"
        component={PaymentInstalmentsEditScreen}
        options={{
          headerTitle: '',
          headerTitleAlign: 'center'
        }}
      />
    </Stack.Navigator>
  );
};

export default FirstLoginWizardStackNavigator;
