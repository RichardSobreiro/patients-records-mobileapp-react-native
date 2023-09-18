import EditAnamnesisType from '../../components/customers/patients-crud/anamnesis-crud/anamnesis-types/EditAnamnesisType';

type Props = {
  route: any;
  navigation: any;
};

const EditAnamnesisTypeScreen: React.FC<Props> = ({ route, navigation }) => {
  const { anamnesisTypeId } = route.params;

  return (
    <EditAnamnesisType anamnesisTypeId={anamnesisTypeId} route={route} navigation={navigation} />
  );
};

export default EditAnamnesisTypeScreen;
