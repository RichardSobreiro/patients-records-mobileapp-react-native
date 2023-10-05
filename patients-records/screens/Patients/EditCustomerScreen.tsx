import EditCustomer from '../../components/customers/patients-crud/EditCustomer';

type Props = {
  route: any;
  navigation: any;
};

const EditCustomerScreen: React.FC<Props> = ({ route, navigation }) => {
  const { customerId } = route.params;

  return <EditCustomer customerId={customerId} navigation={navigation} />;
};

export default EditCustomerScreen;
