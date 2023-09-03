//import { styles } from './styles';
import { Colors } from '../../../constants/styles';
import { ErrorType } from '../../customers/patients-crud/services-crud/ServicesList';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';

type Props = {
  field: string;
  label: string;
  values: any;
  touched: any;
  errors: ErrorType;
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

  const onChange = (event, selectedTime) => {
    setVisible(false);
    const currentDate = new Date(selectedTime);
    console.log(`SELECTED HOUR: ${currentDate.getHours()}`);
    console.log(`SELECTED MINUTES: ${currentDate.getMinutes()}`);
    onChangeHandler('hour', currentDate.getHours());
    onChangeHandler('minutes', currentDate.getMinutes());
  };

  return (
    <SafeAreaProvider>
      <Text style={styles.label}>{label}</Text>
      <View style={{ flex: 1, alignItems: 'flex-start' }}>
        <Button
          onPress={() => {
            setVisible(true);
            onBlurHandler(field);
          }}
          uppercase={false}
          mode="outlined"
        >
          {values['hour'].value && values['hour'].value !== ''
            ? `${
                values['hour'].value * 1 < 10 ? '0' + values['hour'].value : values['hour'].value
              }:${
                values['minutes'].value * 1 < 10
                  ? '0' + values['minutes'].value
                  : values['minutes'].value
              }`
            : 'Selecione a hora'}
        </Button>
        {errors.time ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.time}</Text>
          </View>
        ) : null}
        {visible && (
          <DateTimePicker
            testID="dateTimePicker"
            value={new Date()}
            mode={'time'}
            is24Hour={true}
            onChange={onChange}
            onTouchCancel={() => setVisible(false)}
            display="spinner"
            negativeButton={{ label: 'Cancelar' }}
          />
        )}
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
