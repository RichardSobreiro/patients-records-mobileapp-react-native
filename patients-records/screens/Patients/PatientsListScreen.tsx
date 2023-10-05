/* eslint-disable import/order */
import CustomersList from '../../components/customers/CustomersList';
import { AuthContext } from '../../store/auth-context';
import { EditPatientStackParamList } from '../navigators/EditPatientsBottomTabsNavigator';
import { RootStackParamList } from './PatientsHomeScreen';

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useContext, useEffect } from 'react';

export type HomeScreenNavigationProp = CompositeScreenProps<
  NativeStackScreenProps<RootStackParamList, 'PatientsList'>,
  BottomTabScreenProps<EditPatientStackParamList>
>;

const PatientsListScreen: React.FC = ({ navigation }: HomeScreenNavigationProp) => {
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

export default PatientsListScreen;
