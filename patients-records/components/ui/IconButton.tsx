import { Colors } from '../../constants/styles';
import { Ionicons } from '@expo/vector-icons';
import { GestureResponderEvent, Pressable, StyleSheet, Text } from 'react-native';

interface Props {
  icon;
  color;
  size;
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
  pressable?;
  label?: string;
  labelStyle?;
}

const IconButton: React.FC<Props> = ({
  icon,
  color,
  size,
  onPress,
  pressable,
  label,
  labelStyle
}) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed, pressable]}
      onPress={onPress}
    >
      <Ionicons name={icon} color={color} size={size} />
      {label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
    </Pressable>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderColor: Colors.primary500,
    borderRadius: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center'
  },
  pressed: {
    opacity: 0.7
  },
  label: {
    fontSize: 16,
    color: Colors.primary500
  }
});
