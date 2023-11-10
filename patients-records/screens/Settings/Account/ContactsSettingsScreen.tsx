import ContactsSettings from '../../../components/settings/account/ContactsSettings';

type Props = {
  route: any;
  navigation: any;
};

const ContactsSettingsScreen: React.FC<Props> = ({ route, navigation }) => {
  return <ContactsSettings navigation={navigation} />;
};

export default ContactsSettingsScreen;
