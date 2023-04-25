import AuthContent from '../components/authentication/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { login } from '../util/auth';
import { useContext, useState } from 'react';
import { Alert } from 'react-native';

const LoginScreen: React.FC = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      authCtx.authenticate(token);
    } catch (error) {
      Alert.alert(
        'Authentication failed!',
        'Could not log you in. Please check your credentials or try again later!'
      );
      setIsAuthenticating(false);
    }
  }

  const socialLoginCallback = (token: {
    access_token: string;
    expires_in: string;
    refresh_token: string;
  }) => {
    authCtx.authenticate(token);
  };

  if (isAuthenticating) {
    return <LoadingOverlay message="Logging you in..." />;
  }

  return (
    <AuthContent isLogin onAuthenticate={loginHandler} socialLoginCallback={socialLoginCallback} />
  );
};

export default LoginScreen;
