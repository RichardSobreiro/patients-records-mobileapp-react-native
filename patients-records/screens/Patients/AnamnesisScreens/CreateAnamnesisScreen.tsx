import CreateAnamnesis from '../../../components/customers/patients-crud/anamnesis-crud/create-anamnesis/CreateAnamnesis';

type Props = {
  route: any;
  navigation: any;
};

const CreateAnamnesisScreen: React.FC<Props> = ({ route, navigation }) => {
  const { customerId } = route.params;

  return <CreateAnamnesis customerId={customerId} route={route} navigation={navigation} />;
};

export default CreateAnamnesisScreen;
