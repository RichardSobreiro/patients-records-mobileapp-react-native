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

    return () => {
      if (tabNavigator) {
        tabNavigator.setOptions({
          headerShown: true
        });
      }
    };
  }, [authCtx.userInfo?.username, navigation, route]);

  return (
    <>
      <CustomersList navigation={navigation} />
    </>
  );
};

export default PatientsListScreen;
