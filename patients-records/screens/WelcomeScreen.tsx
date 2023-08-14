import CustomersList from '../components/welcome-screen/CustomersList';
import { AuthContext } from '../store/auth-context';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { EditPatientStackParamList, RootStackParamList } from 'App';
import { useContext, useEffect } from 'react';

export type HomeScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, 'Welcome'>,
  BottomTabScreenProps<EditPatientStackParamList>
>;

const WelcomeScreen: React.FC = ({ navigation }: HomeScreenNavigationProp) => {
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    navigation.setOptions({ title: authCtx.userInfo?.username });
  }, [authCtx.userInfo?.username, navigation]);

  return (
    <>
      <CustomersList navigation={navigation} />
    </>
  );
};

export default WelcomeScreen;
