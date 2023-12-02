import { Colors } from '../../constants/styles';

import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  navigation: any;
  route?: any;
  state: any;
  descriptors: any;
};

const CustomSideBarPaymentIssueDrawerNavigator: React.FC<Props> = (props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ marginTop: 40 }}>
        <Image style={styles.sideMenuProfileIcon} source={require('../../assets/favicon.png')} />
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <TouchableOpacity
          onPress={() => {
            props.navigation.navigate('Logout');
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginHorizontal: 20,
              marginVertical: 20
            }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: Colors.primary500 }}>Sair</Text>
          </View>
        </TouchableOpacity>
      </DrawerContentScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sideMenuProfileIcon: {
    resizeMode: 'contain',
    width: '95%',
    height: 60
  },
  customItem: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center'
  }
});

export default CustomSideBarPaymentIssueDrawerNavigator;
