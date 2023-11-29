import PaymentMethodsList from '../../../../components/settings/payment/Methods/PaymentMethodsList';

type Props = {
  navigation: any;
};

const PaymentMethodsListScreen: React.FC<Props> = ({ navigation }) => {
  return <PaymentMethodsList navigation={navigation} />;
};

export default PaymentMethodsListScreen;
