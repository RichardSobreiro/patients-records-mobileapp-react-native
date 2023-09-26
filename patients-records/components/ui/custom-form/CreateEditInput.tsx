import { Colors } from '../../../constants/styles';
import { GetSectionItem } from '../../../models/customers/anamnesis-types/GetAnamnesisTypeByIdResponse';
import Dropdown from '../Dropdown';
import { AntDesign } from '@expo/vector-icons';
import { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

type Props = {
  field: string;
  label: string;
  questionPhrase: string;
  onChangeHandlerQuestionPhrase: (field: string, value: any) => void;
  onRemoveQuestionHandler?: (field: string) => void;
  sectionOptions?: GetSectionItem[] | undefined;
  onChangeHandlerQuestionSection?: (field: string, sectionId: string) => void;
  sectionId?: string;
};

const CreateEditInput: React.FC<Props> = ({
  field,
  label,
  questionPhrase,
  onRemoveQuestionHandler,
  onChangeHandlerQuestionPhrase,
  sectionOptions,
  onChangeHandlerQuestionSection,
  sectionId
}) => {
  const invalid = false;

  const [inputs, setInputs] = useState<{
    sectionId: {
      value: string | undefined;
      isValid: boolean;
    };
  }>({
    sectionId: {
      value: sectionId,
      isValid: true
    }
  });

  const [touched, setTouched] = useState<{ sectionId: boolean }>({
    sectionId: false
  });

  const [errors] = useState<{ sectionId: string | null }>({
    sectionId: null
  });

  const handleChange = (fieldInternal: string, enteredValue: any) => {
    setTouched((curTouched) => {
      curTouched[fieldInternal] = true;
      return curTouched;
    });
    setInputs((curInputs) => {
      const newInputs = {
        ...curInputs,
        [fieldInternal]: { value: enteredValue, isValid: true }
      };
      onChangeHandlerQuestionSection?.(field, enteredValue);
      return newInputs;
    });
  };

  return (
    <View style={[styles.inputContainer]}>
      {onRemoveQuestionHandler ? (
        <View style={styles.topLabelContainer}>
          <Text style={[styles.labelQuestion, invalid && styles.invalidLabel]}>{label}</Text>
          <TouchableOpacity onPress={() => onRemoveQuestionHandler(field)}>
            <AntDesign name="delete" size={30} color={Colors.primary500} />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={[styles.labelQuestion, invalid && styles.invalidLabel]}>{label}</Text>
      )}

      {sectionOptions && sectionOptions.length > 0 && (
        <Dropdown
          field="sectionId"
          label="Seção:"
          values={inputs}
          touched={touched}
          errors={errors}
          onChangeHandler={handleChange}
          data={sectionOptions?.map((s) => {
            return { label: s.sectionTitle, value: s.sectionId };
          })}
        />
      )}

      <TextInput
        style={[styles.label, invalid && styles.invalidLabel]}
        value={questionPhrase}
        onChangeText={(text) => onChangeHandlerQuestionPhrase(field, text)}
        returnKeyType="next"
        placeholder={'Nova pergunta...'}
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
  topLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
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
    marginBottom: 4,
    marginTop: 15
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
