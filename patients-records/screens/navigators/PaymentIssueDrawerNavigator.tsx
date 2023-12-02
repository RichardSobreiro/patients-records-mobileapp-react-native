import CustomSideBarMainDrawerNavigator from '../../components/ui/CustomSideBarMainDrawerNavigator';
import IconButton from '../../components/ui/IconButton';
import { Colors } from '../../constants/styles';
import BackgroundSync from '../../hooks/BackgroundSync';
import { AccountSettingsContext } from '../../store/user-notifications-context';
import LogoutScreen from '../Logout/LogoutScreen';
import NotificationsScreen from '../Notifications/NotificationsScreen';
import PaymentsPlansSettingsStackNavigator from './Settings/PaymentsPlansSettingsStackNavigator';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { useContext, useLayoutEffect } from 'react';
import { View } from 'react-native';
import { Badge } from 'react-native-paper';

export type PaymentIssueDrawerParamList = {
  Settings;
  Notifications;
  Logout;
};

const PaymentIssueDrawer = createDrawerNavigator<PaymentIssueDrawerParamList>();

const PaymentIssueDrawerNavigator = () => {
  const userNotificationCtx = useContext(AccountSettingsContext);
  const navigation = useNavigation<NavigationProp<PaymentIssueDrawerParamList>>();

  useLayoutEffect(() => {
    userNotificationCtx.updateUserNotificationsState();
  });

  // setInterval(userNotificationCtx.updateUserNotificationsState, 120000);
  // setInterval(userNotificationCtx.updateAccountSettingsState, 60000);

  return (
    <>
      <BackgroundSync />
      <PaymentIssueDrawer.Navigator
        id="PaymentIssueDrawerNavigator"
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
        initialRouteName={'Settings'}
      >
        <PaymentIssueDrawer.Screen
          name="Settings"
          options={{
            drawerLabel: 'Configurações',
            headerTitle: 'Configurações'
          }}
          component={PaymentsPlansSettingsStackNavigator}
        />
        <PaymentIssueDrawer.Screen
          name="Notifications"
          options={{
            drawerLabel: 'Notificações',
            headerTitle: 'Notificações'
          }}
          component={NotificationsScreen}
        />
        <PaymentIssueDrawer.Screen
          name="Logout"
          options={{
            drawerLabel: 'Sair',
            headerTitle: 'Deseja realmente sair?',
            drawerItemStyle: { display: 'none' },
            drawerActiveBackgroundColor: 'transparent'
          }}
          component={LogoutScreen}
        />
      </PaymentIssueDrawer.Navigator>
    </>
  );
};

export default PaymentIssueDrawerNavigator;
