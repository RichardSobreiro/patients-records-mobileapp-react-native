/* eslint-disable import/order */
import { Colors } from '../../constants/styles';
import FlatButton from '../ui/FlatButton';
import AuthForm from './AuthForm';
import FacebookAuthentication from './Facebook';

import { useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

interface Props {
  navigation: any;
  isLogin: boolean;
  onAuthenticate: (params: { email?: string; password?: string; username?: string }) => void;
  facebookCallback?: (params: {
    facebook_access_token: string;
    app_id: string;
    user_id: string;
    username: string;
    email: string;
    pictureUrl: string;
  }) => void;
}

const Login: React.FC<Props> = ({ navigation, isLogin, onAuthenticate, facebookCallback }) => {
  const [credentialsInvalid, setCredentialsInvalid] = useState({
    email: false,
    password: false,
    confirmEmail: false,
    confirmPassword: false,
    username: false
  });

  function switchAuthModeHandler() {
    if (isLogin) {
      navigation.replace('Signup');
    } else {
      navigation.replace('Login');
    }
  }

  function submitHandler(credentials) {
    let { email, confirmEmail, password, confirmPassword, username } = credentials;

    email = email.trim();
    password = password.trim();
    username = username.trim();

    const emailIsValid = email.includes('@');
    const passwordIsValid = password.length > 6;
    const emailsAreEqual = email === confirmEmail;
    const passwordsAreEqual = password === confirmPassword;
    const usernameIsValid = username.length >= 3;

    if (
      !emailIsValid ||
      !passwordIsValid ||
      (!isLogin && (!emailsAreEqual || !passwordsAreEqual || !usernameIsValid))
    ) {
      Alert.alert('Parâmetros inválidos!', 'Verifique seu e-mail, senha e nome de usuário!');
      setCredentialsInvalid({
        email: !emailIsValid,
        confirmEmail: !emailIsValid || !emailsAreEqual,
        password: !passwordIsValid,
        confirmPassword: !passwordIsValid || !passwordsAreEqual,
        username: !usernameIsValid
      });
      return;
    }
    onAuthenticate({ email, password, username });
  }

  return (
    <KeyboardAwareScrollView>
      <View style={styles.authContent}>
        <AuthForm
          isLogin={isLogin}
          onSubmit={submitHandler}
          credentialsInvalid={credentialsInvalid}
        />
        <View style={styles.buttons}>
          <FlatButton onPress={switchAuthModeHandler}>
            {isLogin ? 'Criar novo usuário' : 'Entrar'}
          </FlatButton>
        </View>
      </View>
      {isLogin && (
        <View style={styles.facebookContent}>
          <FacebookAuthentication
            isLogin={isLogin}
            callback={facebookCallback!}
          ></FacebookAuthentication>
        </View>
      )}
    </KeyboardAwareScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  facebookContent: {
    marginTop: 10,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary800
    // elevation: 2,
    // shadowColor: '#000000',
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.35,
    // shadowRadius: 4
  },
  authContent: {
    marginTop: 64,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    backgroundColor: Colors.primary800
    // elevation: 2,
    // shadowColor: '#000000',
    // shadowOffset: { width: 1, height: 1 },
    // shadowOpacity: 0.35,
    // shadowRadius: 4
  },
  buttons: {
    marginTop: 8
  }
});
