import CreatePaymentMethod from '../../../../components/settings/payment/Methods/CreatePaymentMethod';

type Props = {
  navigation: any;
};

const CreatePaymentMethodScreen: React.FC<Props> = ({ navigation }) => {
  return <CreatePaymentMethod navigation={navigation} />;
};

export default CreatePaymentMethodScreen;
