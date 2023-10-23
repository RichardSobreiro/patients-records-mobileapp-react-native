import { Button, View } from 'react-native';

const FinancialHomeScreen = ({ route, navigation }) => {
  console.log(`ROUTE: ${JSON.stringify(route)}`);
  console.log(`NAVIGATION: ${JSON.stringify(navigation)}`);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button onPress={() => navigation.navigate('PatientsHome')} title="Pacientes" />
    </View>
  );
};

export default FinancialHomeScreen;
