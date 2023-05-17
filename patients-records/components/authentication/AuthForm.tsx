/* eslint-disable import/order */
import Button from '../ui/Button';
import Input from './Input';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

interface OnSubmitParams {
  email: string;
  confirmEmail: string;
  password: string;
  confirmPassword: string;
  username: string;
}

interface Props {
  isLogin?: boolean;
  onSubmit: (params: OnSubmitParams) => void;
  credentialsInvalid;
}

const AuthForm: React.FC<Props> = ({ isLogin, onSubmit, credentialsInvalid }) => {
  const [enteredEmail, setEnteredEmail] = useState('');
  const [enteredConfirmEmail, setEnteredConfirmEmail] = useState('');
  const [enteredPassword, setEnteredPassword] = useState('');
  const [enteredConfirmPassword, setEnteredConfirmPassword] = useState('');
  const [enteredUsername, setEnteredUsername] = useState('');

  const {
    email: emailIsInvalid,
    confirmEmail: emailsDontMatch,
    password: passwordIsInvalid,
    confirmPassword: passwordsDontMatch,
    username: usernameIsValid
  } = credentialsInvalid;

  function updateInputValueHandler(inputType, enteredValue) {
    switch (inputType) {
      case 'email':
        setEnteredEmail(enteredValue);
        break;
      case 'confirmEmail':
        setEnteredConfirmEmail(enteredValue);
        break;
      case 'password':
        setEnteredPassword(enteredValue);
        break;
      case 'confirmPassword':
        setEnteredConfirmPassword(enteredValue);
        break;
      case 'username':
        setEnteredUsername(enteredValue);
        break;
    }
  }

  function submitHandler() {
    onSubmit({
      email: enteredEmail,
      confirmEmail: enteredConfirmEmail,
      password: enteredPassword,
      confirmPassword: enteredConfirmPassword,
      username: enteredUsername
    });
  }

  return (
    <View style={styles.form}>
      <View>
        {!isLogin && (
          <Input
            label="Nome do Usuário"
            onUpdateValue={updateInputValueHandler.bind(this, 'username')}
            value={enteredUsername}
            keyboardType="default"
            isInvalid={usernameIsValid}
          />
        )}
        <Input
          label="E-mail"
          onUpdateValue={updateInputValueHandler.bind(this, 'email')}
          value={enteredEmail}
          keyboardType="email-address"
          isInvalid={emailIsInvalid}
        />
        {!isLogin && (
          <Input
            label="Confirme seu E-mail"
            onUpdateValue={updateInputValueHandler.bind(this, 'confirmEmail')}
            value={enteredConfirmEmail}
            keyboardType="email-address"
            isInvalid={emailsDontMatch}
          />
        )}
        <Input
          label="Senha"
          onUpdateValue={updateInputValueHandler.bind(this, 'password')}
          secure
          value={enteredPassword}
          isInvalid={passwordIsInvalid}
        />
        {!isLogin && (
          <Input
            label="Confirme sua Senha"
            onUpdateValue={updateInputValueHandler.bind(this, 'confirmPassword')}
            secure
            value={enteredConfirmPassword}
            isInvalid={passwordsDontMatch}
          />
        )}
        <View style={styles.buttons}>
          <Button onPress={submitHandler}>{isLogin ? 'Entrar' : 'Cadastrar-se'}</Button>
        </View>
      </View>
    </View>
  );
};

export default AuthForm;

const styles = StyleSheet.create({
  form: {},
  buttons: {
    marginTop: 12
  }
});
