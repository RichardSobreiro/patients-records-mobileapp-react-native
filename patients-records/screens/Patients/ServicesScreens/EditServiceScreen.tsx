import EditService from '../../../components/customers/patients-crud/services-crud/edit-services/EditService';

type Props = {
  route: any;
  navigation: any;
};

const EditServiceScreen: React.FC<Props> = ({ route, navigation }) => {
  const { customerId, serviceId, showCreatedSnackbar } = route.params;

  return (
    <EditService
      customerId={customerId}
      serviceId={serviceId}
      showCreatedSnackbar={showCreatedSnackbar}
      route={route}
      navigation={navigation}
    />
  );
};

export default EditServiceScreen;
