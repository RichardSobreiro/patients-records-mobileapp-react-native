/* eslint-disable import/order */
import { Colors } from '../../constants/styles';
import { facebookCallbackParams } from '../../util/auth';
import { AntDesign } from '@expo/vector-icons';
import { makeRedirectUri } from 'expo-auth-session';
import * as Facebook from 'expo-auth-session/providers/facebook';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

const app_id: string = '592502122839259';

interface Props {
  isLogin: boolean;
  callback: (params: facebookCallbackParams) => void;
}

const FacebookAuthentication: React.FC<Props> = ({ isLogin, callback }) => {
  // exp://192.168.0.24:19000

  // const redirectUrl = getRedirectUrl();

  // console.log(`REDIRECT URL: ${redirectUrl}`);

  // console.log(`DEFAULT REDIRECT URL: ${getDefaultReturnUrl()}`);

  console.log(`MAKE REDIRECT URI:
    ${makeRedirectUri({
      //scheme: 'com.sobreirostechnologies.patientsrecords://',
      native: 'com.sobreirostechnologies.patientsrecords://'
    })}`);
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: app_id
  });

  useEffect(() => {
    if (response && response.type === 'success' && response.authentication) {
      (async () => {
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${
            response.authentication!.accessToken
          }&fields=id,name,email,picture.type(large)`
        );
        const userInfo = await userInfoResponse.json();

        await callback({
          facebook_access_token: response.authentication!.accessToken,
          app_id,
          user_id: userInfo.id,
          username: userInfo.name,
          email: userInfo.email,
          pictureUrl: userInfo.picture.data.url
        });
      })();
    } else {
      console.log(response);
    }
  }, [callback, response]);

  const handlePressAsync = async () => {
    const result = await promptAsync();
    if (result.type !== 'success') {
      alert('Ops!?!!Alguma deu errado. Tente novamente!');
    }
  };

  return (
    <Pressable
      disabled={!request}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={handlePressAsync}
    >
      <View style={styles.container}>
        <Text style={styles.buttonText}>Entrar com o Facebook</Text>
        <AntDesign name="facebook-square" size={36} color="#FFFFFF" />
      </View>
    </Pressable>
  );
};

export default FacebookAuthentication;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around'
  },
  button: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary500,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  pressed: {
    opacity: 0.7
  },
  buttonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '900'
  }
});
