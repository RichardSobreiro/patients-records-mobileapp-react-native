import ServicesList from '../components/welcome-screen/patients-crud/ServicesList';

type Props = {
  route: any;
  navigation: any;
};

const ServicesListScreen: React.FC<Props> = ({ route, navigation }) => {
  const { customerId } = route.params;

  return (
    <>
      <ServicesList customerId={customerId} />
    </>
  );
};

export default ServicesListScreen;
