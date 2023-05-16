import { RootStackParamList } from '../App';
import AuthContent from '../components/authentication/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { createUser } from '../util/auth';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack/';
import { useState } from 'react';
import { Alert } from 'react-native';

const SignupScreen: React.FC = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigation = useNavigation<StackNavigationProp<RootStackParamList>>();

  async function signupHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      await createUser(email, password);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Ops!?!? Algo deu errado.', 'Tente novamente!');
      setIsAuthenticating(false);
    }
  }

  if (isAuthenticating) {
    return <LoadingOverlay message="Creating user..." />;
  }

  return <AuthContent isLogin={false} onAuthenticate={signupHandler} />;
};

export default SignupScreen;
