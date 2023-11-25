import PaymentsSettings from '../../../components/settings/payment/PaymentsSettings';

type Props = {
  route: any;
  navigation: any;
};

const PaymentsSettingsScreen: React.FC<Props> = ({ route, navigation }) => {
  return <PaymentsSettings navigation={navigation} />;
};

export default PaymentsSettingsScreen;
