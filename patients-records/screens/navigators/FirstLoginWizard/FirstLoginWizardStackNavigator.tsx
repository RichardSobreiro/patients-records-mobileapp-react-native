import PlanSettingsScreen from '../../../components/settings/paymentplan/PlanSettingsScreen';
import { Colors } from '../../../constants/styles';
import BusinessSettingsScreen from '../../../screens/Settings/Business/BusinessSettingsScreen';
import MessagesSettingsScreen from '../../../screens/Settings/Messages/MessagesSettingsScreen';
import AccountSettingsTopTabsNavigator from '../Settings/AccountsSettingsTopTabsNavigator';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

export type LogintStackParamList = {
  BasicUserInfo;
  BusinessInfo;
  MessageSettings;
  PlanInfo;
  PaymentMethod;
  PaymentStatus;
  Summary;
};

const Stack = createNativeStackNavigator<LogintStackParamList>();

const FirstLoginWizardStackNavigator = () => {
  return (
    <Stack.Navigator
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
          headerTitle: 'Configuração das Mensagens',
          headerTitleAlign: 'center'
        }}
      />
    </Stack.Navigator>
  );
};

export default FirstLoginWizardStackNavigator;
