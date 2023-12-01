import EditPaymentMethod from '../../../../components/settings/payment/Methods/EditPaymentMethod';

type Props = {
  navigation: any;
};

const EditPaymentMethodScreen: React.FC<Props> = ({ navigation }) => {
  return <EditPaymentMethod navigation={navigation} />;
};

export default EditPaymentMethodScreen;
