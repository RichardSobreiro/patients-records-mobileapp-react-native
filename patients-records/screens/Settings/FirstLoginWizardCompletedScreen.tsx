import FirstLoginWizardCompleted from '../../components/settings/FirstLoginWizardCompleted';

type Props = {
  route: any;
  navigation: any;
};

const FirstLoginWizardCompletedScreen: React.FC<Props> = ({ route, navigation }) => {
  return <FirstLoginWizardCompleted navigation={navigation} />;
};

export default FirstLoginWizardCompletedScreen;
