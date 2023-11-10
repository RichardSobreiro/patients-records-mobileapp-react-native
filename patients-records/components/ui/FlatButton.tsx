import { Colors } from '../../constants/styles';

import { GestureResponderEvent, Pressable, StyleSheet, Text, View } from 'react-native';

export enum ButtonTypes {
  Primary = 'primary'
}

interface Props {
  children: any;
  onPress: ((event: GestureResponderEvent) => void) | null | undefined;
  type?: ButtonTypes;
  pressable?;
  view?;
  text?;
}

const FlatButton: React.FC<Props> = ({ children, onPress, pressable, view, text }) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.button, pressed && styles.pressed, pressable]}
      onPress={onPress}
    >
      <View style={view}>
        <Text style={[styles.buttonText, text]}>{children}</Text>
      </View>
    </Pressable>
  );
};

export default FlatButton;

const styles = StyleSheet.create({
  button: {
    paddingVertical: 6
  },
  pressed: {
    opacity: 0.7
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    paddingHorizontal: 15
  }
});
