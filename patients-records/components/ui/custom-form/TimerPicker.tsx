//import { styles } from './styles';
import { Colors } from '../../../constants/styles';
import { ErrorType } from '../../customers/patients-crud/services-crud/ServicesList';
import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Button } from 'react-native-paper';

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
  const [dateValue, setDateValue] = useState<Date>(new Date());

  useEffect(() => {
    if (values['hour'].value !== undefined && values['minutes'].value !== undefined) {
      const newDateValue = new Date();
      newDateValue.setHours(values['hour'].value, values['minutes'].value);
      setDateValue(newDateValue);
    }
  }, [values]);

  const onChange = (selectedTime) => {
    setVisible(false);
    const currentDate = new Date(selectedTime);
    onChangeHandler('hour', currentDate.getHours());
    onChangeHandler('minutes', currentDate.getMinutes());
  };

  return (
    <>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Button
          onPress={() => {
            setVisible(true);
            onBlurHandler(field);
          }}
          uppercase={false}
          mode="outlined"
          style={{ width: '100%' }}
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
      </View>
      <DateTimePicker
        locale="pt_BR"
        isVisible={visible}
        date={dateValue}
        mode={'time'}
        is24Hour={true}
        onConfirm={onChange}
        onCancel={() => setVisible(false)}
        cancelTextIOS="Cancelar"
        confirmTextIOS="Selecionar"
        negativeButton={{ label: 'Cancelar' }}
        positiveButton={{ label: 'Selecionar' }}
        timePickerModeAndroid="default"
      />
    </>
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
