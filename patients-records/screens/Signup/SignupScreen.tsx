import Signup from '../../components/authentication/Signup/Signup';

type Props = {
  route: any;
  navigation: any;
};

const SignupScreen: React.FC<Props> = ({ navigation, route }) => {
  return <Signup navigation={navigation} />;
};

export default SignupScreen;
