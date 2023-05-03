import { Colors } from '../../constants/styles';
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';

interface Props {
  children: any;
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
  buttonTextStyles?;
  buttonStyles?;
}

const FlatButton: React.FC<Props> = ({ children, onPress, buttonTextStyles, buttonStyles }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed, buttonStyles]}
      onPress={onPress}
    >
      <View>
        <Text style={[styles.buttonText, buttonTextStyles]}>{children}</Text>
      </View>
    </Pressable>
  );
};

export default FlatButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12
  },
  pressed: {
    opacity: 0.7
  },
  buttonText: {
    textAlign: 'center',
    color: Colors.primary100
  }
});
