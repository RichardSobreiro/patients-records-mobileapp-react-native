import LoginData from '../../components/authentication/Signup/LoginData';

type Props = {
  route: any;
  navigation: any;
};

const SignupScreen: React.FC<Props> = ({ navigation, route }) => {
  return <LoginData navigation={navigation} />;
};

export default SignupScreen;
