import Login from '../../components/authentication/Login';
import LoadingOverlay from '../../components/ui/LoadingOverlay';
import { AuthContext } from '../../store/auth-context';
import { authenticateFacebook, facebookCallbackParams, login } from '../../util/auth';

import { useCallback, useContext, useState } from 'react';
import { Alert } from 'react-native';

type Props = {
  route: any;
  navigation: any;
};

const LoginScreen: React.FC<Props> = ({ navigation, route }) => {
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const authCtx = useContext(AuthContext);

  async function loginHandler({ email, password }) {
    setIsAuthenticating(true);
    try {
      const accessToken = await login(email, password);
      if (accessToken) {
        authCtx.authenticate(accessToken, {
          userId: accessToken.userId,
          username: accessToken.username,
          email: accessToken.email,
          userCreationCompleted: accessToken.userCreationCompleted,
          userPlanId: accessToken.userPlanId,
          paymentStatus: accessToken.paymentStatus,
          companyName: accessToken.companyName
        });
      } else {
        Alert.alert(
          'Ops?!?! Falha na autenticação.',
          'Verifique suas credencias e tente novamente!'
        );
      }
    } catch {
      Alert.alert('Ops?!?! Falha na autenticação.', 'Verifique suas credencias e tente novamente!');
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
          await authCtx.authenticate(accessToken, {
            userId: '',
            username: params.username,
            email: params.email,
            userCreationCompleted: accessToken.userCreationCompleted as unknown as boolean,
            userPlanId: accessToken.userPlanId,
            paymentStatus: accessToken.paymentStatus,
            companyName: accessToken.companyName
          });
        } else {
          throw new Error('The user was not authenticated.');
        }
      } catch {
        Alert.alert(
          'Ops?!?! Falha na autenticação.',
          'Verifique suas credencias e tente novamente!'
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

  return (
    <Login
      navigation={navigation}
      isLogin
      onAuthenticate={loginHandler}
      facebookCallback={facebookCallback}
    />
  );
};

export default LoginScreen;
