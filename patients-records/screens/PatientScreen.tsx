import CreateEditPatient from '../components/welcome-screen/patients-crud/CreateEditPatient';

type Props = {
  route: any;
  navigation: any;
};

const PatientScreen: React.FC<Props> = ({ route, navigation }) => {
  const { patientId } = route.params;

  return <CreateEditPatient patientId={patientId} />;
};

export default PatientScreen;
