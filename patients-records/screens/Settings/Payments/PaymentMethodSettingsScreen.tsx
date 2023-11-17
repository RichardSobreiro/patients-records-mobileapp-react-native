import PaymentMethodSettings from '../../../components/settings/Payment/PaymentMethodSettings';

type Props = {
  route: any;
  navigation: any;
};

const PaymentMethodSettingsScreen: React.FC<Props> = ({ route, navigation }) => {
  return <PaymentMethodSettings navigation={navigation} />;
};

export default PaymentMethodSettingsScreen;
