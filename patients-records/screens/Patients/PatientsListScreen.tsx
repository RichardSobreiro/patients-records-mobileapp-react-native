/* eslint-disable import/order */
import CustomersList from '../../components/customers/CustomersList';
import { AuthContext } from '../../store/auth-context';

import { useContext, useLayoutEffect } from 'react';

const PatientsListScreen = ({ route, navigation }) => {
  const authCtx = useContext(AuthContext);

  useLayoutEffect(() => {
    if (!navigation || !route) return;

    navigation.setOptions({ title: authCtx.userInfo?.username });

    const tabNavigator = navigation.getParent('PatientsHomeScreenStack');
    if (tabNavigator) {
      tabNavigator.setOptions({
        headerShown: false
      });
    }
    const routes = navigation.getState()?.routes;
    let mainDrawerNavigator: any = undefined;
    if (routes.length >= 2) {
      const prevRoute = routes[routes.length - 2];
      if (prevRoute.name === 'AgendaHome') {
        mainDrawerNavigator = navigation.getParent('MainDrawerNavigator');
        if (mainDrawerNavigator) {
          mainDrawerNavigator.setOptions({
            headerShown: false
          });
        }
      }
    }

    return () => {
      tabNavigator?.setOptions({
        headerShown: true
      });
      mainDrawerNavigator?.setOptions({
        headerShown: true
      });
    };
  }, [authCtx.userInfo?.username, navigation, route]);

  return (
    <>
      <CustomersList navigation={navigation} />
    </>
  );
};

export default PatientsListScreen;
