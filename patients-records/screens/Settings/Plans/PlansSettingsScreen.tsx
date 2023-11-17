import PlanSettings from '../../../components/settings/plan/PlanSettings';

type Props = {
  route: any;
  navigation: any;
};

const PlanSettingsScreen: React.FC<Props> = ({ route, navigation }) => {
  return <PlanSettings navigation={navigation} />;
};

export default PlanSettingsScreen;
