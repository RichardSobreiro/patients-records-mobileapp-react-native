import AgendaHomeScreen from '../Agenda/AgendaHomeScreen';
import FinancialHomeScreen from '../Financial/FinancialHomeScreen';
import PatientsHomeScreen from '../Patients/PatientsHomeScreen';

import { createDrawerNavigator } from '@react-navigation/drawer';

const Drawer = createDrawerNavigator();

const MainDrawerNavigatorComp = () => {
  return (
    <Drawer.Navigator initialRouteName="PatientsHome">
      <Drawer.Screen name="Agenda" component={AgendaHomeScreen} />
      <Drawer.Screen name="PatientsHome" component={PatientsHomeScreen} />
      <Drawer.Screen name="Financial" component={FinancialHomeScreen} />
    </Drawer.Navigator>
  );
};

export default MainDrawerNavigatorComp;
