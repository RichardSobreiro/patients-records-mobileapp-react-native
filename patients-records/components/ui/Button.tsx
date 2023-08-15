import { Colors } from '../../constants/styles';
import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';

export enum ButtonTypes {
  Primary = 'primary',
  Cancel = 'cancel'
}

interface Props {
  children: any;
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
  type?: ButtonTypes;
  pressable?;
  view?;
  text?;
}

const Button: React.FC<Props> = ({ children, onPress, pressable, view, text, type }) => {
  let BUTTON_COLOR = { backgroundColor: Colors.primary500 };
  let TEXT_COLOR = { color: '#ffffff' };
  if (type) {
    switch (type) {
      case ButtonTypes.Primary:
        BUTTON_COLOR = { backgroundColor: Colors.secondary500 };
        break;
      case ButtonTypes.Cancel:
        BUTTON_COLOR = { backgroundColor: Colors.tertiary300 };
        TEXT_COLOR = { color: Colors.tertiary800 };
        break;
      default:
        BUTTON_COLOR = { backgroundColor: Colors.primary500 };
        break;
    }
  }
  return (
    <Pressable
      style={({ pressed }) => [styles.button, BUTTON_COLOR, pressed && styles.pressed, pressable]}
      onPress={onPress}
    >
      <View style={[view, { flex: 1 }]}>
        <Text style={[styles.buttonText, text, TEXT_COLOR]}>{children}</Text>
      </View>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: Colors.primary500,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    flex: 1
  },
  pressed: {
    opacity: 0.7
  },
  buttonText: {
    textAlign: 'center',
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});
