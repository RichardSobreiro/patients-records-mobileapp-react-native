import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Image, SafeAreaView, StyleSheet, View } from 'react-native';

type Props = {
  navigation: any;
  route?: any;
  state: any;
  descriptors: any;
};

const CustomSideBarMainDrawerNavigator: React.FC<Props> = (props) => {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ marginTop: 40 }}>
        <Image style={styles.sideMenuProfileIcon} source={require('../../assets/favicon.png')} />
      </View>
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
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

export default CustomSideBarMainDrawerNavigator;
