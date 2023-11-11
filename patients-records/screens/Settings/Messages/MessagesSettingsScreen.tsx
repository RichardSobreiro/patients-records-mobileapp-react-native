import MessagesSettings from '../../../components/settings/messages/MessagesSettings';

type Props = {
  route: any;
  navigation: any;
};

const MessagesSettingsScreen: React.FC<Props> = ({ route, navigation }) => {
  return <MessagesSettings navigation={navigation} />;
};

export default MessagesSettingsScreen;
