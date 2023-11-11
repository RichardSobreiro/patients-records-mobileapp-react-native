import { Colors } from '../../../constants/styles';

import { useEffect, useRef, useState } from 'react';
import { KeyboardTypeOptions, StyleSheet, Text, View } from 'react-native';
import MaskInput from 'react-native-mask-input';
import { TextInput } from 'react-native-paper';

type Props = {
  field: string;
  label: string;
  keyboardType?: KeyboardTypeOptions;
  values?;
  touched?;
  errors?;
  onChangeHandler?: (field: string, value: any) => void;
  onBlurHandler?: (field: string, value: any) => void;
  textInputConfig?;
  scrollTos?: any;
  handleScrollTo?: (field: string, value: boolean) => void;
  scrollViewRef?: any;
  secureTextEntry?: boolean;
  textContentType?:
    | 'none'
    | 'URL'
    | 'addressCity'
    | 'addressCityAndState'
    | 'addressState'
    | 'countryName'
    | 'creditCardNumber'
    | 'emailAddress'
    | 'familyName'
    | 'fullStreetAddress'
    | 'givenName'
    | 'jobTitle'
    | 'location'
    | 'middleName'
    | 'name'
    | 'namePrefix'
    | 'nameSuffix'
    | 'nickname'
    | 'organizationName'
    | 'postalCode'
    | 'streetAddressLine1'
    | 'streetAddressLine2'
    | 'sublocality'
    | 'telephoneNumber'
    | 'username'
    | 'password'
    | 'newPassword'
    | 'oneTimeCode'
    | undefined;
  disabled?: boolean;
  placeholder?: string;
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
  scrollViewRef,
  secureTextEntry,
  textContentType,
  disabled,
  placeholder
}) => {
  const invalid = errors[field];
  const ref = useRef<any>(null);
  const [isPasswordSecure, setIsPasswordSecure] = useState<boolean>(true);

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
            { paddingLeft: 15 },
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
          disabled={disabled ? disabled : false}
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
          secureTextEntry={secureTextEntry && isPasswordSecure}
          textContentType={textContentType}
          right={
            secureTextEntry ? (
              <TextInput.Icon
                icon={isPasswordSecure ? 'eye-off' : 'eye'}
                size={28}
                color={Colors.primary500}
                onPress={() => {
                  setIsPasswordSecure((curValue) => !curValue);
                }}
              />
            ) : undefined
          }
          placeholder={placeholder}
          placeholderTextColor={Colors.placeholder}
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
    height: 50,
    padding: 0,
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
