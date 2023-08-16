//import { styles } from './styles';
import { Colors } from '../../../constants/styles';
import React, { useCallback, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { TimePickerModal } from 'react-native-paper-dates';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type Props = {
  field: string;
  label: string;
  values: any;
  touched: any;
  errors: any;
  onChangeHandler: (field: string, value: any) => void;
  onBlurHandler: (field: string) => void;
};

const TimerPicker: React.FC<Props> = ({
  field,
  label,
  values,
  touched,
  errors,
  onChangeHandler,
  onBlurHandler
}) => {
  const [visible, setVisible] = useState(false);

  const onDismiss = useCallback(() => {
    setVisible(false);
  }, [setVisible]);

  const onConfirm = React.useCallback(
    ({ hours, minutes }) => {
      setVisible(false);
      onChangeHandler(field, { hours, minutes });
      console.log({ hours, minutes });
    },
    [field, onChangeHandler]
  );
  return (
    <SafeAreaProvider>
      <Text style={styles.label}>{label}</Text>
      <View style={{ justifyContent: 'center', flex: 1, alignItems: 'center' }}>
        <Button
          onPress={() => {
            setVisible(true);
            onBlurHandler(field);
          }}
          uppercase={false}
          mode="outlined"
        >
          Selecione a hora
        </Button>
        <TimePickerModal
          visible={visible}
          onDismiss={onDismiss}
          onConfirm={onConfirm}
          hours={9}
          minutes={0}
          locale="pt"
          cancelLabel="Cancelar"
          label="Selecione o horário:"
        />
      </View>
    </SafeAreaProvider>
  );
};

export default TimerPicker;

const styles = StyleSheet.create({
  label: {
    fontSize: 18,
    color: Colors.primary500,
    marginBottom: 4
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    color: '#ff7675'
  }
});
