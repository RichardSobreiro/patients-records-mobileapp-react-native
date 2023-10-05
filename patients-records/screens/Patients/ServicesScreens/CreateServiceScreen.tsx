import CreateService from '../../../components/customers/patients-crud/services-crud/create-services/CreateService';

type Props = {
  route: any;
  navigation: any;
};

const CreateServiceScreen: React.FC<Props> = ({ route, navigation }) => {
  const { customerId } = route.params;

  return (
    <>
      <CreateService customerId={customerId} route={route} navigation={navigation} />
    </>
  );
};

export default CreateServiceScreen;
