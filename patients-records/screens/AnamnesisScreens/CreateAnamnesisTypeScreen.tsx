import CreateAnamnesisType from '../../components/customers/patients-crud/anamnesis-crud/anamnesis-types/CreateAnamnesisType';
import { useLayoutEffect } from 'react';
import { Text, TouchableOpacity } from 'react-native';

type Props = {
  route: any;
  navigation: any;
};

const CreateAnamnesisTypeScreen: React.FC<Props> = ({ route, navigation }) => {
  useLayoutEffect(() => {
    if (!navigation || !route) return;

    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            borderColor: '#1be428',
            borderWidth: 1,
            borderRadius: 20,
            paddingVertical: 5,
            paddingHorizontal: 10
          }}
        >
          <Text style={{ color: '#1be428' }}>Salvar</Text>
        </TouchableOpacity>
      )
    });

    const tabNavigator = navigation.getParent('RootStack');
    if (tabNavigator) {
      console.log('RootStack FOUND');
      if (route.name === 'EditAnamnesisType') {
        tabNavigator.setOptions({
          headerShown: false
        });
      }
    }

    return () => {
      console.log('UNMOUNT');
      tabNavigator.setOptions({
        headerShown: true
      });
    };
  }, [navigation, route]);

  return <CreateAnamnesisType />;
};

export default CreateAnamnesisTypeScreen;
