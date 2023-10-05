import { Button, View } from 'react-native';

const AgendaHomeScreen = ({ route, navigation }) => {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('PatientsList')} title="Pacientes" />
    </View>
  );
};

export default AgendaHomeScreen;
