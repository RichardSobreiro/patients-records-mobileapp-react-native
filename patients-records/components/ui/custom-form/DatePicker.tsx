//import { styles } from './styles';
import { Colors } from '../../../constants/styles';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';

type Props = {
  field?;
  label?;
  values?;
  touched?;
  errors?;
  text?;
  onChangeHandler: (field: string, value: any) => void;
};

const DatePicker: React.FC<Props> = ({
  field,
  label,
  values,
  touched,
  errors,
  text,
  onChangeHandler
}) => {
  const [show, setShow] = useState(false);

  const onChange = (event, selectedDate) => {
    if (event.type === 'set') {
      const currentDate = selectedDate;
      setShow(false);
      values[field].value = currentDate;
      onChangeHandler(field, currentDate);
    } else {
      const currentDate = null;
      setShow(false);
      touched[field] = false;
      values[field].value = currentDate;
      onChangeHandler(field, currentDate);
    }
  };

  const showDatepicker = () => {
    setShow(true);
  };

  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={({ pressed }) => [pressed && styles.pressed]} onPress={showDatepicker}>
        <View style={styles.inputTextContainer}>
          <Text style={[styles.input, text]}>
            {values[field].value ? values[field].value.toDateString() : null}
          </Text>
        </View>
      </Pressable>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={values[field].value ? values[field].value : new Date()}
          mode={'date'}
          is24Hour={true}
          onChange={onChange}
          positiveButton={{ label: 'Selecionar' }}
          negativeButton={{ label: 'Cancelar' }}
        />
      )}

      {errors[field] ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errors[field]}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default DatePicker;

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 10
  },
  label: {
    fontSize: 18,
    color: 'white',
    marginBottom: 4
  },
  pressed: {
    opacity: 0.7
  },
  input: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    height: 50,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#e3e3e3',
    backgroundColor: Colors.primary100,
    color: Colors.primary800
  },
  inputTextContainer: {
    justifyContent: 'center',
    alignContent: 'center'
  },
  inputText: {
    textAlign: 'center',
    textAlignVertical: 'center'
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    color: '#ff7675'
  }
});
