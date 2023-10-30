import { Colors } from '../../../constants/styles';

import { useState } from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  field: string;
  inputs: {
    [key: string]: { value: any; isValid: boolean };
  };
  touched: {
    [key: string]: boolean;
  };
  errors: {
    [key: string]: string | null;
  };
  onChangeHandler: (field: string, value: any) => void;
  onBlurHandler: (field: string, value: any) => void;
  editable?: boolean;
  keyboardType?: KeyboardTypeOptions;
  maxLength?: number;
  defaultValue?: string;
};

const InlineInput: React.FC<Props> = ({
  field,
  inputs,
  touched,
  errors,
  onChangeHandler,
  onBlurHandler,
  editable,
  keyboardType,
  maxLength,
  defaultValue
}) => {
  const [value, setValue] = useState<string>(
    typeof inputs[field].value === 'number'
      ? inputs[field].value.toString()
      : inputs[field].value ?? ''
  );

  return (
    <>
      <TextInput
        style={[
          styles.textInput,
          editable ? {} : { color: Colors.tertiary500, borderColor: Colors.tertiary500 }
        ]}
        value={value}
        defaultValue={defaultValue ?? ''}
        onChangeText={(text) => {
          if (keyboardType === 'number-pad') {
            setValue(text.replace(/\D/g, ''));
          } else {
            setValue(text);
          }
          onChangeHandler(field, text);
        }}
        onBlur={onBlurHandler?.bind(null, field)}
        keyboardType={keyboardType ?? 'default'}
        maxLength={maxLength}
        editable={editable}
      />
      {errors[field] ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errors[field]}</Text>
        </View>
      ) : null}
    </>
  );
};

export default InlineInput;

const styles = StyleSheet.create({
  textInput: {
    borderWidth: 1,
    borderColor: Colors.primary500,
    borderRadius: 15,
    marginHorizontal: 5,
    paddingHorizontal: 10,
    paddingVertical: 0,
    fontSize: 18,
    color: Colors.primary500
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    color: '#ff7675'
  }
});
