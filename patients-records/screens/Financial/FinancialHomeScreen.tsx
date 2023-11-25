import { AuthContext } from '../../store/auth-context';

import { useFocusEffect } from '@react-navigation/native';
import { useContext } from 'react';
import { Button, View } from 'react-native';

const FinancialHomeScreen = ({ route, navigation }) => {
  const authCtx = useContext(AuthContext);

  useFocusEffect(() => {
    if (!authCtx.userInfo?.userCreationCompleted) {
      navigation?.navigate('FirstLoginWizard');
    }
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('PatientsHome')} title="Pacientes" />
    </View>
  );
};

export default FinancialHomeScreen;
