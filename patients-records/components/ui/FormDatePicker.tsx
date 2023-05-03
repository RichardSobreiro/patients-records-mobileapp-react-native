//import { styles } from './styles';
import Button from './Button';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Platform, Pressable } from 'react-native';

type Props = {
  field?;
  label?;
  secureTextEntry?;
  autoCapitalize?;
  values?;
  touched?;
  errors?;
  handleChange?;
  handleBlur?;
};

const FormDatePicker: React.FC<Props> = ({
  field,
  label,
  secureTextEntry,
  autoCapitalize,
  values,
  touched,
  errors,
  handleChange,
  handleBlur
}) => {
  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [show, setShow] = useState(false);

  values[field] = date;

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate;
    setShow(false);
    setDate(currentDate);
    values[field] = currentDate;
  };

  const showMode = (currentMode) => {
    if (Platform.OS === 'android') {
      setShow(false);
      // for iOS, add a button that closes the picker
    }
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
    setShow(true);
  };

  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>

      <Pressable style={({ pressed }) => [pressed && styles.pressed]} onPress={showDatepicker}>
        <View style={styles.inputTextContainer}>
          <Text style={styles.input}>{date.toDateString()}</Text>
        </View>
      </Pressable>
      {show && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={'date'}
          is24Hour={true}
          onChange={onChange}
        />
      )}

      {touched[field] && errors[field] ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errors[field]}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default FormDatePicker;

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 10
  },
  label: {
    color: '#7d7e79',
    fontSize: 16,
    lineHeight: 30
  },
  pressed: {
    opacity: 0.7
  },
  input: {
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
    height: 50,
    //paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#e3e3e3',
    backgroundColor: '#fff'
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
