import CreateAnamnesisType from '../../components/customers/patients-crud/anamnesis-crud/anamnesis-types/CreateAnamnesisType';

type Props = {
  route: any;
  navigation: any;
};

const CreateAnamnesisTypeScreen: React.FC<Props> = ({ route, navigation }) => {
  return <CreateAnamnesisType route={route} navigation={navigation} />;
};

export default CreateAnamnesisTypeScreen;
