import AnamnesisList from '../components/customers/patients-crud/anamnesis-crud/AnamnesisList';

type Props = {
  route: any;
  navigation: any;
};

const AnamnesisListScreen: React.FC<Props> = ({ route, navigation }) => {
  const { customerId } = route.params;

  return (
    <>
      <AnamnesisList customerId={customerId} />
    </>
  );
};

export default AnamnesisListScreen;
