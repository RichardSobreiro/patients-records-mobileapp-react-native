import { Colors } from '../../../constants/styles';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  field: string;
  label: string;
  keyboardType?: string;
  values?;
  touched?;
  errors?;
  onChangeHandler: (field: string, value: any) => void;
  onBlurHandler: (field: string, value: any) => void;
  textInputConfig?;
};

const Input: React.FC<Props> = ({
  field,
  label,
  keyboardType,
  values,
  touched,
  errors,
  onChangeHandler,
  onBlurHandler,
  textInputConfig
}) => {
  const invalid = errors[field];
  return (
    <View style={[styles.inputContainer]}>
      <Text style={[styles.label, invalid && styles.invalidLabel]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          textInputConfig?.multiline && styles.inputMultiline,
          invalid && styles.invalidInput
        ]}
        value={values[field].value}
        onChangeText={onChangeHandler.bind(null, field)}
        onBlur={onBlurHandler.bind(null, field)}
        {...textInputConfig}
        keyboardType={keyboardType}
      />
      {errors[field] ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errors[field]}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8
  },
  label: {
    fontSize: 18,
    color: 'white',
    marginBottom: 4
  },
  input: {
    backgroundColor: Colors.primary100,
    color: Colors.primary800,
    minHeight: 50,
    padding: 6,
    fontSize: 18,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#e3e3e3'
  },
  inputMultiline: {
    minHeight: 100,
    textAlignVertical: 'top'
  },
  invalidLabel: {
    color: Colors.error500
  },
  invalidInput: {
    backgroundColor: Colors.error100
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    color: '#ff7675'
  }
});
