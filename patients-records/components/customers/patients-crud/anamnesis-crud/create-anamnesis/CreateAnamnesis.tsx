import { StyleSheet } from 'react-native';

type Props = {
  customerId: string;
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setCreatedAnamnesisId: React.Dispatch<React.SetStateAction<string | undefined>>;
  setShowCreatedAnamnesisSnackbar: React.Dispatch<React.SetStateAction<boolean>>;
};

const CreateAnamnesis: React.FC<Props> = ({
  customerId,
  visible,
  setVisible,
  setCreatedAnamnesisId,
  setShowCreatedAnamnesisSnackbar
}) => {
  return <></>;
};

export default CreateAnamnesis;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20
  },
  containerButtonStyle: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 10,
    paddingRight: 30,
    width: '100%'
  }
});
