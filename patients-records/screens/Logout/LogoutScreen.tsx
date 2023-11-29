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
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
      }}
    >
      <TouchableOpacity
        style={{ borderWidth: 1, borderColor: Colors.primary500, borderRadius: 20, padding: 20 }}
        onPress={() => {
          navigation.goBack();
        }}
      >
        <Text style={{ color: Colors.primary500, fontSize: 40, fontWeight: 'bold' }}>Não</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{ borderWidth: 1, borderColor: Colors.primary500, borderRadius: 20, padding: 20 }}
        onPress={() => {
          authCtx.logout();
        }}
      >
        <Text style={{ color: Colors.primary500, fontSize: 40, fontWeight: 'bold' }}>Sim</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LogoutScreen;
