import AddressSettings from '../../../components/settings/account/AddressSettings';

type Props = {
  route: any;
  navigation: any;
};

const AddressSettingsScreen: React.FC<Props> = ({ route, navigation }) => {
  return <AddressSettings navigation={navigation} />;
};

export default AddressSettingsScreen;
