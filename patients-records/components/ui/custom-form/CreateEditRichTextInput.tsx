import { Colors } from '../../../constants/styles';
import React, { useRef, useState } from 'react';
import { Text, StyleSheet, View, useWindowDimensions, TextInput } from 'react-native';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';

const handleHead = ({ tintColor }) => <Text style={{ color: tintColor }}>H1</Text>;
const handleHead2 = ({ tintColor }) => <Text style={{ color: tintColor }}>H2</Text>;

type Props = {
  field: string;
  label: string;
  questionPhrase: string;
  onChangeHandlerQuestionPhrase: (field: string, value: any) => void;
};

const CreateEditRichTextInput: React.FC<Props> = ({
  field,
  label,
  questionPhrase,
  onChangeHandlerQuestionPhrase
}) => {
  const richText = useRef<any>(undefined);
  const dimensions = useWindowDimensions();
  const [, setEditorAttached] = useState<boolean>(false);

  const invalid = false;

  richText.current?.registerToolbar(function (items) {
    setEditorAttached(true);
  });

  return (
    <View
      style={{
        marginTop: 15,
        paddingHorizontal: 2,
        paddingVertical: 10,
        borderWidth: 1,
        borderStyle: 'dashed'
      }}
    >
      <Text style={[styles.labelQuestion, invalid && styles.invalidLabel]}>{label}</Text>

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
    flexWrap: 'wrap'
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
