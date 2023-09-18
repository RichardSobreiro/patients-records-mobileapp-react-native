import { Colors } from '../../../constants/styles';
import { StyleSheet, Text, TextInput, View } from 'react-native';

type Props = {
  field: string;
  label: string;
  questionPhrase: string;
  onChangeHandlerQuestionPhrase: (field: string, value: any) => void;
};

const CreateEditInput: React.FC<Props> = ({
  field,
  label,
  questionPhrase,
  onChangeHandlerQuestionPhrase
}) => {
  const invalid = false;

  return (
    <View style={[styles.inputContainer, field === '1' ? { borderWidth: 0 } : {}]}>
      <Text style={[styles.labelQuestion, invalid && styles.invalidLabel]}>{label}</Text>

      <TextInput
        style={[styles.label, invalid && styles.invalidLabel]}
        value={questionPhrase}
        onChangeText={(text) => onChangeHandlerQuestionPhrase(field, text)}
        returnKeyType="next"
      />

      <TextInput
        style={[styles.input, invalid && styles.invalidInput]}
        value={''}
        returnKeyType="next"
        editable={false}
      />
    </View>
  );
};

export default CreateEditInput;

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
