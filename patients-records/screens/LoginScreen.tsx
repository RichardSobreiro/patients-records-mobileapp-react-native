import AuthContent from '../components/authentication/AuthContent';
import LoadingOverlay from '../components/ui/LoadingOverlay';
import { AuthContext } from '../store/auth-context';
import { login, authenticateFacebook, facebookCallbackParams } from '../util/auth';
import { useCallback, useContext, useState } from 'react';
import { Alert } from 'react-native';

const LoginScreen: React.FC = () => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const token = await login(email, password);
      //authCtx.authenticate(token);
    } catch (error) {
      Alert.alert(
        'Authentication failed!',
        'Could not log you in. Please check your credentials or try again later!'
      );
    }
    setIsAuthenticating(false);
  }

  const facebookCallback = useCallback(
    async (params: facebookCallbackParams) => {
      setIsAuthenticating(true);

      const loginFacebook = async (params: facebookCallbackParams) => {
        const token = await authenticateFacebook(params);
        return token;
      };

      try {
        const accessToken = await loginFacebook(params);
        if (accessToken) {
          authCtx.authenticate(accessToken, { username: params.username, email: params.email });
        } else {
          throw new Error('The user was not authenticated.');
        }
      } catch {
        Alert.alert(
          'Authentication failed!',
          'Could not log you in. Please check your credentials or try again later!'
        );
      } finally {
        setIsAuthenticating(false);
      }
    },
    [authCtx]
  );

  if (isAuthenticating) {
    return <LoadingOverlay message="Fazendo login..." />;
  }

  return <AuthContent isLogin onAuthenticate={loginHandler} facebookCallback={facebookCallback} />;
};

export default LoginScreen;
