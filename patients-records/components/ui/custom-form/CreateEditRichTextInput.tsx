import { Colors } from '../../../constants/styles';
import { GetSectionItem } from '../../../models/customers/anamnesis-types/GetAnamnesisTypeByIdResponse';
import Dropdown from '../Dropdown';
import { AntDesign } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  View,
  useWindowDimensions,
  TextInput,
  TouchableOpacity
} from 'react-native';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';

const handleHead = ({ tintColor }) => <Text style={{ color: tintColor }}>H1</Text>;
const handleHead2 = ({ tintColor }) => <Text style={{ color: tintColor }}>H2</Text>;

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

const CreateEditRichTextInput: React.FC<Props> = ({
  field,
  label,
  questionPhrase,
  onRemoveQuestionHandler,
  onChangeHandlerQuestionPhrase,
  sectionOptions,
  onChangeHandlerQuestionSection,
  sectionId
}) => {
  const richText = useRef<any>(undefined);
  const dimensions = useWindowDimensions();
  const [, setEditorAttached] = useState<boolean>(false);

  const invalid = false;

  richText.current?.registerToolbar(function (items) {
    setEditorAttached(true);
  });

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
    <View
      style={{
        paddingHorizontal: 2,
        paddingVertical: 10,
        borderWidth: 1,
        borderStyle: 'dashed',
        marginHorizontal: 4,
        marginVertical: 8
      }}
    >
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
        style={[styles.label]}
        value={questionPhrase}
        onChangeText={(text) => onChangeHandlerQuestionPhrase(field, text)}
        returnKeyType="next"
        placeholder={'Nova pergunta...'}
      />

      <View style={[styles.editorStyleContainer, { maxWidth: dimensions.width * 1 }]}>
        <RichEditor
          ref={richText}
          onChange={(descriptionText) => {}}
          editorStyle={styles.editorStyle}
          initialHeight={250}
          disabled={true}
        />
      </View>

      <RichToolbar
        style={[{ maxWidth: dimensions.width * 1 }]}
        editor={richText}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.setStrikethrough,
          actions.blockquote,
          actions.insertOrderedList,
          actions.checkboxList,
          actions.insertBulletsList,
          actions.alignCenter,
          actions.alignFull,
          actions.alignLeft,
          actions.alignRight,
          actions.insertLink,
          actions.heading1,
          actions.heading2
        ]}
        iconMap={{ [actions.heading1]: handleHead, [actions.heading2]: handleHead2 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
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
  invalidLabel: {
    color: Colors.error500
  },
  invalidInput: {
    backgroundColor: Colors.error100
  },
  label: {
    fontSize: 18,
    color: Colors.primary500,
    marginBottom: 4,
    flexWrap: 'wrap',
    marginTop: 15
  },
  editorStyleContainer: {
    borderColor: Colors.primary500,
    borderWidth: 2,
    borderRadius: 5
  },
  editorStyle: {
    backgroundColor: Colors.primary100
  }
});

export default CreateEditRichTextInput;
