import { AuthContext } from '../../store/auth-context';

import { useFocusEffect } from '@react-navigation/native';
import { useContext } from 'react';
import { Button, View } from 'react-native';

const ReportsHomeScreen = ({ route, navigation }) => {
  const authCtx = useContext(AuthContext);

  useFocusEffect(() => {
    if (!authCtx.userInfo?.userCreationCompleted) {
      navigation?.navigate('FirstLoginWizard');
    }
  });

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('PatientsList')} title="Pacientes" />
    </View>
  );
};

export default ReportsHomeScreen;
