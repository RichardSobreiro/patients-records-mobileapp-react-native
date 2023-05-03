//import { styles } from './styles';
import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

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

const FormField: React.FC<Props> = ({
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
  return (
    <View style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        style={styles.input}
        value={values[field]}
        onChangeText={handleChange(field)}
        onBlur={handleBlur(field)}
        secureTextEntry={secureTextEntry}
        autoCapitalize={autoCapitalize || 'none'}
      />

      {touched[field] && errors[field] ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errors[field]}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default FormField;

const styles = StyleSheet.create({
  formGroup: {
    marginBottom: 10
  },
  label: {
    color: '#7d7e79',
    fontSize: 16,
    lineHeight: 30
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#e3e3e3',
    backgroundColor: '#fff'
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    color: '#ff7675'
  }
});
