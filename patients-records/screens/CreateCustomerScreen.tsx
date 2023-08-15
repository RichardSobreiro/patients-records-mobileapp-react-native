import CreateCustomer from '../components/welcome-screen/patients-crud/CreateCustomer';

type Props = {
  route: any;
  navigation: any;
};

const CreateCustomerScreen: React.FC<Props> = ({ route, navigation }) => {
  return <CreateCustomer navigation={navigation} />;
};

export default CreateCustomerScreen;
