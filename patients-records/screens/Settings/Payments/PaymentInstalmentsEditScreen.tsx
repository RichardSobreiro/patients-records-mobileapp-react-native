import PaymentInstalmentsEdit from '../../../components/settings/Payment/PaymentInstalmentEdit';

type Props = {
  route: any;
  navigation: any;
};

const PaymentInstalmentsEditScreen: React.FC<Props> = ({ route, navigation }) => {
  const { paymentInstalmentsId } = route.params;
  return (
    <PaymentInstalmentsEdit navigation={navigation} paymentInstalmentsId={paymentInstalmentsId} />
  );
};

export default PaymentInstalmentsEditScreen;
