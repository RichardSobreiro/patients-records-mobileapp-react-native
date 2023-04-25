/* eslint-disable import/order */
import { Colors } from '../../constants/styles';
import { AntDesign } from '@expo/vector-icons';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as WebBrowser from 'expo-web-browser';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

interface Props {
  isLogin: boolean;
  callback: (token: { access_token: string; expires_in: string; refresh_token: string }) => void;
}

const FacebookAuthentication: React.FC<Props> = ({ isLogin, callback }) => {
  const [, response, promptAsync] = Facebook.useAuthRequest({
    clientId: '592502122839259'
  });

  useEffect(() => {
    if (response && response.type === 'success' && response.authentication) {
      (async () => {
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${
            response.authentication!.accessToken
          }&fields=id,name,picture.type(large)`
        );
        const userInfo = await userInfoResponse.json();
        console.log(userInfo);
      })();
    } else {
      console.log(response);
    }
  }, [response]);

  const handlePressAsync = async () => {
    const result = await promptAsync();
    if (result.type !== 'success') {
      alert('Uh oh, something went wrong');
      //return;
    }
  };

  // function Profile({ user }) {
  //   return (
  //     <View style={styles.profile}>
  //       <Image source={{ uri: user.picture.data.url }} style={styles.image} />
  //       <Text style={styles.name}>{user.name}</Text>
  //       <Text>ID: {user.id}</Text>
  //     </View>
  //   );
  // }

  // return (
  //   <View style={styles.container}>
  //     {user ? (
  //       <Profile user={user} />
  //     ) : (
  //       <Button disabled={!request} title="Sign in with Facebook" onPress={handlePressAsync} />
  //     )}
  //   </View>
  // );

  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
      onPress={handlePressAsync}
    >
      <View style={styles.container}>
        <Text style={styles.buttonText}>Sign in with Facebook</Text>
        <AntDesign name="facebook-square" size={36} color="white" />
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
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4
  },
  pressed: {
    opacity: 0.7
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold'
  }
  // container: {
  //   flex: 1,
  //   alignItems: 'center',
  //   justifyContent: 'center'
  // },
  // profile: {
  //   alignItems: 'center'
  // },
  // name: {
  //   fontSize: 20
  // },
  // image: {
  //   width: 100,
  //   height: 100,
  //   borderRadius: 50
  // }
});
