import { Colors } from '../../../constants/styles';
import { useEffect, useRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import MaskInput from 'react-native-mask-input';

type Props = {
  field: string;
  label: string;
  keyboardType?: string;
  values?;
  touched?;
  errors?;
  onChangeHandler?: (field: string, value: any) => void;
  onBlurHandler?: (field: string, value: any) => void;
  textInputConfig?;
  scrollTos?: any;
  handleScrollTo?: (field: string, value: boolean) => void;
  scrollViewRef?: any;
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
  textInputConfig,
  scrollTos,
  handleScrollTo,
  scrollViewRef
}) => {
  const invalid = errors[field];
  const ref = useRef<any>(null);

  useEffect(() => {
    if (scrollViewRef && handleScrollTo && scrollTos) {
      ref?.current!.measureLayout(scrollViewRef.current, (x, y, width, height, pageX, pageY) => {
        if (scrollTos[field]) {
          scrollViewRef.current.scrollTo({
            x,
            y,
            animated: true
          });
        }
        handleScrollTo?.(field, false);
      });
    }
  }, [field, handleScrollTo, scrollTos, scrollViewRef, ref]);

  return (
    <View ref={ref} onLayout={(event) => {}} style={[styles.inputContainer]}>
      <Text style={[styles.label, invalid && styles.invalidLabel]}>{label}</Text>

      {keyboardType === 'phone-pad' ? (
        <MaskInput
          style={[
            styles.input,
            textInputConfig?.multiline && styles.inputMultiline,
            invalid && styles.invalidInput
          ]}
          value={values[field].value}
          onChangeText={onChangeHandler?.bind(null, field)}
          onBlur={onBlurHandler?.bind(null, field)}
          {...textInputConfig}
          keyboardType={keyboardType}
          returnKeyType="next"
          mask={[
            '(',
            /\d/,
            /\d/,
            ')',
            ' ',
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            /\d/,
            '-',
            /\d/,
            /\d/,
            /\d/,
            /\d/
          ]}
        />
      ) : (
        <TextInput
          style={[
            styles.input,
            textInputConfig?.multiline && styles.inputMultiline,
            invalid && styles.invalidInput
          ]}
          value={values[field].value}
          onChangeText={onChangeHandler?.bind(null, field)}
          onBlur={onBlurHandler?.bind(null, field)}
          {...textInputConfig}
          keyboardType={keyboardType}
          returnKeyType="next"
          editable={!!(onBlurHandler && onChangeHandler)}
          selectTextOnFocus={!!(onBlurHandler && onChangeHandler)}
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

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8
  },
  label: {
    fontSize: 18,
    color: Colors.primary500,
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
    borderColor: Colors.primary500
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
