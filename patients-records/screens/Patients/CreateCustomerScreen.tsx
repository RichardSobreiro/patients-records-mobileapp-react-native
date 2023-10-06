import CreateCustomer from '../../components/customers/patients-crud/CreateCustomer';

import { useLayoutEffect } from 'react';

type Props = {
  route: any;
  navigation: any;
};

const CreateCustomerScreen: React.FC<Props> = ({ route, navigation }) => {
  useLayoutEffect(() => {
    if (!navigation || !route) return;

    navigation.setOptions({
      headerShown: true
    });

    const mainDrawer = navigation.getParent('MainDrawerNavigator');
    if (mainDrawer) {
      mainDrawer.setOptions({
        headerShown: false
      });
    }

    return () => {
      if (mainDrawer) {
        mainDrawer.setOptions({
          headerShown: true
        });
      }
    };
  }, [navigation, route]);

  return <CreateCustomer navigation={navigation} />;
};

export default CreateCustomerScreen;
