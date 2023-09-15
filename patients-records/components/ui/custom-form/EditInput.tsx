import { Colors } from '../../../constants/styles';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  field: string;
  label: string;
  keyboardType?: string;
  values?;
  touched?;
  errors?;
  onChangeHandler?: (field: string, value: any) => void;
  onChangeHandlerQuestionPhrase?: (field: string, value: any) => void;
  onBlurHandler?: (field: string, value: any) => void;
  textInputConfig?;
  scrollTos?: any;
  handleScrollTo?: (field: string, value: boolean) => void;
  scrollViewRef?: any;
};

const EditInput: React.FC<Props> = ({
  field,
  label,
  keyboardType,
  values,
  touched,
  errors,
  onChangeHandler,
  onChangeHandlerQuestionPhrase,
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
      <Text style={[styles.labelQuestion, invalid && styles.invalidLabel]}>{label}</Text>

      <TextInput
        style={[styles.label, invalid && styles.invalidLabel]}
        value={values[field].questionPhrase}
        onChangeText={onChangeHandlerQuestionPhrase?.bind(null, field)}
        returnKeyType="next"
        selectTextOnFocus={!!(onBlurHandler && onChangeHandler)}
      />

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
        editable={false}
        selectTextOnFocus={!!(onBlurHandler && onChangeHandler)}
      />

      {errors[field] ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errors[field]}</Text>
        </View>
      ) : null}
    </View>
  );
};

export default EditInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    paddingVertical: 10,
    paddingHorizontal: 2
  },
  labelQuestion: {
    fontSize: 16,
    fontStyle: 'italic',
    textDecorationLine: 'underline',
    color: Colors.primary500,
    marginBottom: 4
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
