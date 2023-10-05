import EditAnamnesis from '../../../components/customers/patients-crud/anamnesis-crud/edit-anamnesis/EditAnamnesis';

type Props = {
  route: any;
  navigation: any;
};

const EditAnamnesisScreen: React.FC<Props> = ({ route, navigation }) => {
  const { customerId, anamnesisId, showCreatedSnackbar } = route.params;

  return (
    <EditAnamnesis
      customerId={customerId}
      anamnesisId={anamnesisId}
      route={route}
      navigation={navigation}
      showCreatedSnackbar={showCreatedSnackbar}
    />
  );
};

export default EditAnamnesisScreen;
