import CreateFirstPayment from '../../../components/settings/payment/CreateFirstPayment';

type Props = {
  route: any;
  navigation: any;
};

const CreateFirstPaymentScreen: React.FC<Props> = ({ route, navigation }) => {
  return <CreateFirstPayment navigation={navigation} />;
};

export default CreateFirstPaymentScreen;
