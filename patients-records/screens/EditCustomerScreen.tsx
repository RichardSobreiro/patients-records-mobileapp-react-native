import EditCustomer from '../components/welcome-screen/patients-crud/EditCustomer';

type Props = {
  route: any;
  navigation: any;
};

const EditCustomerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { customerId } = route.params;

  return <EditCustomer customerId={customerId} navigation={navigation} />;
};

export default EditCustomerScreen;
