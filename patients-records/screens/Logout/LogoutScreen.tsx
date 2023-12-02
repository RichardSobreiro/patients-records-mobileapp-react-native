import { TouchableOpacity } from 'react-native-gesture-handler';

import { Colors } from '../../constants/styles';
import { AuthContext } from '../../store/auth-context';

import { useContext } from 'react';
import { Text, View } from 'react-native';

type Props = {
  navigation: any;
};

const LogoutScreen: React.FC<Props> = ({ navigation }) => {
  const authCtx = useContext(AuthContext);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: Colors.primary100,
        justifyContent: 'center'
      }}
    >
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 60
        }}
      >
        <Text style={{ color: Colors.primary500, fontSize: 22 }}>Deseja realment sair?</Text>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          alignItems: 'center'
        }}
      >
        <TouchableOpacity
          style={{ borderWidth: 1, borderColor: Colors.primary500, borderRadius: 20, padding: 10 }}
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Text style={{ color: Colors.primary500, fontSize: 30, fontWeight: 'bold' }}>Não</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ borderWidth: 1, borderColor: Colors.primary500, borderRadius: 20, padding: 10 }}
          onPress={() => {
            authCtx.logout();
          }}
        >
          <Text style={{ color: Colors.primary500, fontSize: 30, fontWeight: 'bold' }}>Sim</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LogoutScreen;
