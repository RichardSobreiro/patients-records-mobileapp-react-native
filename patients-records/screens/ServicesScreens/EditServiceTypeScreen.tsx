import EditServiceType from '../../components/customers/patients-crud/services-crud/service-types-crud/EditServiceType';

type Props = {
  route: any;
  navigation: any;
};

const EditServiceTypeScreen: React.FC<Props> = ({ route, navigation }) => {
  const { serviceTypeId, showCreatedSnackbar } = route.params;
  return (
    <EditServiceType
      serviceTypeId={serviceTypeId}
      route={route}
      navigation={navigation}
      showCreatedSnackbar={showCreatedSnackbar}
    />
  );
};

export default EditServiceTypeScreen;
