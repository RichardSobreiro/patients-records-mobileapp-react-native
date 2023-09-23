import { Colors } from '../../../constants/styles';
import React, { useEffect, useRef, useState } from 'react';
import { Text, StyleSheet, View, useWindowDimensions, ScrollView } from 'react-native';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';

const handleHead = ({ tintColor }) => <Text style={{ color: tintColor }}>H1</Text>;
const handleHead2 = ({ tintColor }) => <Text style={{ color: tintColor }}>H2</Text>;

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
};

const RichTextInput: React.FC<Props> = ({
  field,
  label,
  keyboardType,
  values,
  touched,
  errors,
  onChangeHandler,
  onBlurHandler
}) => {
  const richText = useRef<any>(undefined);
  const dimensions = useWindowDimensions();
  const [firstRender, setFirstRender] = useState<boolean>(false);
  const [editorAttached, setEditorAttached] = useState<boolean>(false);

  useEffect(() => {
    if (values[field].value !== '' && !firstRender) {
      richText?.current.setContentHTML(values[field].value);
      setFirstRender(true);
    }
  }, [values[field].value]);

  richText.current?.registerToolbar(function (items) {
    setEditorAttached(true);
  });

  return (
    <View style={{ marginHorizontal: 4 }}>
      <Text style={[styles.label, { maxWidth: dimensions.width * 1 }]}>{label}</Text>
      <ScrollView style={[styles.editorStyleContainer, { maxWidth: dimensions.width * 1 }]}>
        <RichEditor
          ref={richText}
          onChange={(descriptionText) => {
            setFirstRender(true);
            onChangeHandler?.(field, descriptionText);
          }}
          onBlur={onBlurHandler?.bind(null, field)}
          editorStyle={styles.editorStyle}
          initialHeight={250}
        />
      </ScrollView>

      <RichToolbar
        style={[{ maxWidth: dimensions.width * 1 }]}
        editor={richText}
        actions={[
          // actions.fontName,
          // actions.fontSize,
          //actions.setParagraph,
          //actions.insertLine,
          //actions.updateHeight,
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

export default RichTextInput;
