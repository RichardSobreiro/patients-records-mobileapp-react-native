import IconButton from '../../components/ui/IconButton';
import { Colors } from '../../constants/styles';
import { AuthContext } from '../../store/auth-context';
import AgendaHomeScreen from '../Agenda/AgendaHomeScreen';
import FinancialHomeScreen from '../Financial/FinancialHomeScreen';
import PatientsHomeScreen from '../Patients/PatientsHomeScreen';
import ReportsHomeScreen from '../Reports/ReportsHomeScreen';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { useContext } from 'react';

const Drawer = createDrawerNavigator();

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
      initialRouteName="PatientsHome"
    >
      <Drawer.Screen name="Agenda" component={AgendaHomeScreen} />
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
        name="Relatórios"
        options={{
          drawerLabel: 'Relatórios',
          headerTitle: 'Relatórios'
        }}
        component={ReportsHomeScreen}
      />
    </Drawer.Navigator>
  );
};

export default MainDrawerNavigatorComp;
