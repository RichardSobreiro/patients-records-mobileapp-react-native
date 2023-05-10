import { Ionicons } from '@expo/vector-icons';
import { GestureResponderEvent, Pressable, StyleSheet, View } from 'react-native';

interface Props {
  icon;
  color;
  size;
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
  pressable?;
}

const IconButton: React.FC<Props> = ({ icon, color, size, onPress, pressable }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed, pressable]}
      onPress={onPress}
    >
      <Ionicons name={icon} color={color} size={size} />
    </Pressable>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  button: {
    margin: 8,
    borderRadius: 20
  },
  pressed: {
    opacity: 0.7
  }
});
