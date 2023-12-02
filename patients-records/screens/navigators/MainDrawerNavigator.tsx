import CustomSideBarMainDrawerNavigator from '../../components/ui/CustomSideBarMainDrawerNavigator';
import IconButton from '../../components/ui/IconButton';
import { Colors } from '../../constants/styles';
import BackgroundSync from '../../hooks/BackgroundSync';
import { AuthContext } from '../../store/auth-context';
import { AccountSettingsContext } from '../../store/user-notifications-context';
import FinancialHomeScreen from '../Financial/FinancialHomeScreen';
import LogoutScreen from '../Logout/LogoutScreen';
import NotificationsScreen from '../Notifications/NotificationsScreen';
import PatientsHomeScreen from '../Patients/PatientsHomeScreen';
import ReportsHomeScreen from '../Reports/ReportsHomeScreen';
import AgendaStackCompScreen from './Agenda/AgendaStackNavigator';
import FirstLoginWizardStackNavigator from './FirstLoginWizard/FirstLoginWizardStackNavigator';
import SettingsBottomTabs from './Settings/SettingsBottomTabsNavigator';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { View } from 'react-native';
import { Badge } from 'react-native-paper';

export type MainDrawerParamList = {
  Agenda: { customerId?: string; serviceId?: string };
  PatientsHome;
  Financial;
  Reports;
  Settings;
  Notifications;
  FirstLoginWizard;
  Logout;
};

const Drawer = createDrawerNavigator<MainDrawerParamList>();

const MainDrawerNavigator = () => {
  const authCtx = useContext(AuthContext);
  const userNotificationCtx = useContext(AccountSettingsContext);
  const navigation = useNavigation<NavigationProp<MainDrawerParamList>>();

  return (
    <>
      <BackgroundSync />
      <Drawer.Navigator
        id="MainDrawerNavigator"
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary500 },
          headerTintColor: '#ffffff',
          headerRight: ({ tintColor }) => (
            <View>
              {userNotificationCtx.unReadNotificationsCount > 0 ? (
                <Badge style={{ top: 12, right: 10 }}>
                  {userNotificationCtx.unReadNotificationsCount}
                </Badge>
              ) : (
                ''
              )}
              <IconButton
                pressable={{ marginRight: 15 }}
                icon="notifications"
                color={tintColor}
                size={30}
                onPress={() => {
                  navigation.navigate('Notifications');
                }}
              />
            </View>
          ),
          drawerStyle: { backgroundColor: Colors.primary100 },
          drawerLabelStyle: {
            color: Colors.primary500,
            fontSize: 18,
            fontWeight: 'bold',
            padding: 10,
            borderWidth: 1,
            borderColor: 'white',
            borderRadius: 20
          }
        }}
        drawerContent={(props) => <CustomSideBarMainDrawerNavigator {...props} />}
        initialRouteName={'Agenda'}
      >
        {authCtx.userInfo?.userCreationCompleted && (
          <>
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
              name="Notifications"
              options={{
                drawerLabel: 'Notificações',
                headerTitle: 'Notificações'
              }}
              component={NotificationsScreen}
            />
            <Drawer.Screen
              name="Logout"
              options={{
                drawerLabel: 'Sair',
                headerTitle: 'Deseja realmente sair?',
                drawerItemStyle: { display: 'none' },
                drawerActiveBackgroundColor: 'transparent'
              }}
              component={LogoutScreen}
            />
          </>
        )}
        {!authCtx.userInfo?.userCreationCompleted && (
          <Drawer.Screen
            name="FirstLoginWizard"
            options={{
              headerTitle: 'Finalizando Cadastro',
              drawerItemStyle: { display: 'none' }
            }}
            component={FirstLoginWizardStackNavigator}
          />
        )}
      </Drawer.Navigator>
    </>
  );
};

export default MainDrawerNavigator;
