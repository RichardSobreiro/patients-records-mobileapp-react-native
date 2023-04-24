import * as WebBrowser from 'expo-web-browser';
import { useEffect, useState } from 'react';
import { Button, Image, StyleSheet, Text, View } from 'react-native';

import * as Facebook from 'expo-auth-session/providers/facebook';

WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [user, setUser] = useState(null);
  const [request, response, promptAsync] = Facebook.useAuthRequest({
    clientId: '592502122839259'
  });

  if (request) {
    console.log(
      'You need to add this url to your authorized redirect urls on your Facebook app: ' +
        request.redirectUri
    );
  }

  useEffect(() => {
    if (response && response.type === 'success' && response.authentication) {
      (async () => {
        const userInfoResponse = await fetch(
          `https://graph.facebook.com/me?access_token=${
            response.authentication!.accessToken
          }&fields=id,name,picture.type(large)`
        );
        const userInfo = await userInfoResponse.json();
        setUser(userInfo);
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

  function Profile({ user }) {
    return (
      <View style={styles.profile}>
        <Image source={{ uri: user.picture.data.url }} style={styles.image} />
        <Text style={styles.name}>{user.name}</Text>
        <Text>ID: {user.id}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {user ? (
        <Profile user={user} />
      ) : (
        <Button disabled={!request} title="Sign in with Facebook" onPress={handlePressAsync} />
      )}
    </View>
    // <View style={styles.container}>
    //   <Text>Open up App.js to start working on your app!</Text>
    //   <StatusBar style="auto" />
    // </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   backgroundColor: '#fff',
  //   alignItems: 'center',
  //   justifyContent: 'center'
  // }
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  profile: {
    alignItems: 'center'
  },
  name: {
    fontSize: 20
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50
  }
});
