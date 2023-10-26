//import { styles } from './styles';
import { Colors } from '../../../constants/styles';
import { ErrorType } from '../../customers/patients-crud/services-crud/ServicesList';

import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import { Button } from 'react-native-paper';

type Props = {
  fieldHours: string;
  fieldMinutes: string;
  label: string;
  values: any;
  touched: any;
  errors: ErrorType;
  onChangeHandler: (field: string, value: any) => void;
  onBlurHandler: (field: string) => void;
};

const DurationPicker: React.FC<Props> = ({
  fieldHours,
  fieldMinutes,
  label,
  values,
  touched,
  errors,
  onChangeHandler,
  onBlurHandler
}) => {
  const [visible, setVisible] = useState(false);
  const [dateValue, setDateValue] = useState<Date>(new Date(new Date().setHours(0, 30, 0, 0)));

  useEffect(() => {
    if (
      !isNaN(values[fieldHours].value) &&
      !isNaN(values[fieldMinutes].value) &&
      values[fieldHours].value >= 0 &&
      values[fieldMinutes].value >= 10
    ) {
      const today = new Date();
      today.setHours(values[fieldHours].value, values[fieldMinutes].value);
      setDateValue(today);
    }
  }, [fieldHours, fieldMinutes, values]);

  const onChange = (selectedTime: Date) => {
    setVisible(false);
    const currentDate = new Date(selectedTime.toISOString());
    currentDate.setHours(selectedTime.getHours(), selectedTime.getMinutes());
    onChangeHandler(fieldHours, currentDate.getHours());
    onChangeHandler(fieldMinutes, currentDate.getMinutes());
  };

  return (
    <>
      <View>
        <Text style={styles.label}>{label}</Text>
        <Button
          onPress={() => {
            setVisible(true);
            onBlurHandler(fieldHours);
            onBlurHandler(fieldMinutes);
          }}
          uppercase={false}
          mode="outlined"
          style={{ width: '100%' }}
        >
          {!isNaN(values[fieldHours].value) &&
          !isNaN(values[fieldMinutes].value) &&
          values[fieldHours].value >= 0 &&
          values[fieldMinutes].value >= 10
            ? `${
                values[fieldHours].value * 1 < 10
                  ? '0' + values[fieldHours].value
                  : values[fieldHours].value
              }:${
                values[fieldMinutes].value * 1 < 10
                  ? '0' + values[fieldMinutes].value
                  : values[fieldMinutes].value
              }`
            : 'Selecione a duração'}
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
        timePickerModeAndroid="clock"
      />
    </>
  );
};

export default DurationPicker;

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
