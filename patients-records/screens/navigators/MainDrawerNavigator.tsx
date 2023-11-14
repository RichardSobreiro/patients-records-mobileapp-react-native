import IconButton from '../../components/ui/IconButton';
import { Colors } from '../../constants/styles';
import { AuthContext } from '../../store/auth-context';
import FinancialHomeScreen from '../Financial/FinancialHomeScreen';
import PatientsHomeScreen from '../Patients/PatientsHomeScreen';
import ReportsHomeScreen from '../Reports/ReportsHomeScreen';
import AgendaStackCompScreen from './Agenda/AgendaStackNavigator';
import FirstLoginWizardStackNavigator from './FirstLoginWizard/FirstLoginWizardStackNavigator';
import SettingsBottomTabs from './Settings/SettingsBottomTabsNavigator';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { useContext } from 'react';

export type MainDrawerParamList = {
  Agenda: { customerId?: string; serviceId?: string };
  PatientsHome;
  Financial;
  Reports;
  Settings;
  FirstLoginWizard;
};

const Drawer = createDrawerNavigator<MainDrawerParamList>();

const MainDrawerNavigatorComp = () => {
  const authCtx = useContext(AuthContext);

  return (
    <Drawer.Navigator
      id="MainDrawerNavigator"
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary500 },
        headerTintColor: '#ffffff',
        headerRight: ({ tintColor }) => (
          <IconButton
            pressable={{ marginRight: 10 }}
            icon="exit"
            color={tintColor}
            size={24}
            onPress={authCtx.logout}
          />
        )
      }}
      initialRouteName={authCtx.userInfo?.userCreationCompleted ? 'Agenda' : 'FirstLoginWizard'}
    >
      <Drawer.Screen
        name="Agenda"
        options={{
          drawerLabel: 'Agenda',
          headerTitle: 'Agenda'
        }}
        component={AgendaStackCompScreen}
      />
      <Drawer.Screen
        name="PatientsHome"
        options={{
          drawerLabel: 'Pacientes',
          headerTitle: 'Pacientes'
        }}
        component={PatientsHomeScreen}
      />
      <Drawer.Screen
        name="Financial"
        options={{
          drawerLabel: 'Financeiro',
          headerTitle: 'Financeiro'
        }}
        component={FinancialHomeScreen}
      />
      <Drawer.Screen
        name="Reports"
        options={{
          drawerLabel: 'Relatórios',
          headerTitle: 'Relatórios'
        }}
        component={ReportsHomeScreen}
      />
      <Drawer.Screen
        name="Settings"
        options={{
          drawerLabel: 'Configurações',
          headerTitle: 'Configurações'
        }}
        component={SettingsBottomTabs}
      />
      <Drawer.Screen
        name="FirstLoginWizard"
        options={{
          headerTitle: 'Finalizando Cadastro',
          drawerItemStyle: { display: 'none' }
        }}
        component={FirstLoginWizardStackNavigator}
      />
    </Drawer.Navigator>
  );
};

export default MainDrawerNavigatorComp;
