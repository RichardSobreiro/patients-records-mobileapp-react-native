import { Colors } from '../../../constants/styles';
import * as React from 'react';
import { Animated, StyleSheet } from 'react-native';
import { Appbar, Button, useTheme } from 'react-native-paper';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export interface StackSheetHeader {
  disableSafeTop?: boolean;
  saveLabel?: string;
  saveLabelDisabled?: boolean;
  uppercase?: boolean;
  onDismiss: () => void;
  onSave: () => void;
  locale: string | undefined;
  closeIcon?: string;
}

export default function StackSheetHeader(props: StackSheetHeader) {
  const theme = useTheme();
  const { disableSafeTop, locale, closeIcon = 'close' } = props;
  const saveLabel = `Salvar`;
  const insets = useSafeAreaInsets();

  return (
    <Animated.View
      style={[
        styles.animated,
        {
          paddingTop: disableSafeTop ? 0 : insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right
        }
      ]}
    >
      <Appbar style={styles.appbarHeader}>
        <Appbar.Action
          icon={closeIcon}
          accessibilityLabel={`fechar`}
          onPress={props.onDismiss}
          color={Colors.primary500}
          testID="react-native-paper-dates-close"
        />
        {/* <Appbar.Content title={''} /> */}
        <Button
          color={Colors.primary500}
          textColor={theme.colors.primary}
          onPress={props.onSave}
          disabled={props.saveLabelDisabled ?? false}
          uppercase={false}
          testID="react-native-paper-dates-save"
        >
          {saveLabel}
        </Button>
      </Appbar>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animated: {
    elevation: 4,
    width: '100%'
  },
  appbarHeader: {
    elevation: 0,
    backgroundColor: 'transparent',
    justifyContent: 'space-between'
  }
});
