import BusinessSettings from '../../../components/settings/business/BusinessSettings';

type Props = {
  route: any;
  navigation: any;
};

const BusinessSettingsScreen: React.FC<Props> = ({ route, navigation }) => {
  return <BusinessSettings navigation={navigation} />;
};

export default BusinessSettingsScreen;
