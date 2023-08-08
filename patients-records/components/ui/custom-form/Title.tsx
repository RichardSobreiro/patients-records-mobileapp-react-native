import { Colors } from '../../../constants/styles';
import { View, Text } from 'react-native';

type Props = {
  text: string;
  color?: string;
};

const Title: React.FC<Props> = ({ text, color }) => {
  return (
    <View
      style={{
        padding: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignContent: 'center'
      }}
    >
      <Text
        style={{
          fontSize: 16,
          color: color ?? Colors.primary800,
          fontWeight: 'bold',
          textAlign: 'center'
        }}
      >
        {text}
      </Text>
    </View>
  );
};

export default Title;
