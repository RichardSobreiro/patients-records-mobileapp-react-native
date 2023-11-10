import AccountSettings from '../../../components/settings/account/AccountSettings';

type Props = {
  route: any;
  navigation: any;
};

const AccountSettingsScreen: React.FC<Props> = ({ route, navigation }) => {
  return <AccountSettings navigation={navigation} />;
};

export default AccountSettingsScreen;
