import CreateServiceType from '../../components/customers/patients-crud/services-crud/service-types-crud/CreateServiceType';

type Props = {
  route: any;
  navigation: any;
};

const CreateServiceTypeScreen: React.FC<Props> = ({ route, navigation }) => {
  return <CreateServiceType route={route} navigation={navigation} />;
};

export default CreateServiceTypeScreen;
