import PaymentInstalmentsEdit from '../../../components/settings/payment/PaymentInstalmentEdit';

type Props = {
  route: any;
  navigation: any;
};

const PaymentInstalmentsEditScreen: React.FC<Props> = ({ route, navigation }) => {
  const { paymentInstalmentsId } = route?.params ? route?.params : '';
  return (
    <PaymentInstalmentsEdit
      navigation={navigation}
      route={route}
      paymentInstalmentsId={paymentInstalmentsId}
    />
  );
};

export default PaymentInstalmentsEditScreen;
