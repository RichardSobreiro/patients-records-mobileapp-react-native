import { RootStackParamList } from '../App';
import AuthContent from '../components/authentication/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { createUser } from '../util/auth';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { Alert } from 'react-native';

const SignupScreen: React.FC = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  async function signupHandler({ email, password, username }) {
    setIsAuthenticating(true);
    try {
      await createUser(email, password, username);
      Alert.alert('Usuário criado com sucesso', 'Agora faça o login!');
      navigation.replace('Login');
    } catch (error: any) {
      Alert.alert('Ops!?!? Algo deu errado.', 'Tente novamente!');
      console.log(error);
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return <AuthContent isLogin={false} onAuthenticate={signupHandler} />;
};

export default SignupScreen;
