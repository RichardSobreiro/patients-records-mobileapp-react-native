import { Colors } from '../../../constants/styles';
import { GetAnamnesisTypeResponse } from '/models/customers/anamnesis-types/GetAnamnesisTypesResponse';
import React, { useEffect, useRef, useState } from 'react';
import {
  Text,
  StyleSheet,
  useWindowDimensions,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { actions, RichEditor, RichToolbar } from 'react-native-pell-rich-editor';

const handleHead = ({ tintColor }) => <Text style={{ color: tintColor }}>H1</Text>;
const handleHead2 = ({ tintColor }) => <Text style={{ color: tintColor }}>H2</Text>;

type Props = {
  label: string;
  currentHTML: string | undefined;
  anamnesisType: GetAnamnesisTypeResponse;
  setSelectedAnamnesisTypes: React.Dispatch<React.SetStateAction<GetAnamnesisTypeResponse[]>>;
};

const RichTextAnamnesisInput: React.FC<Props> = ({
  label,
  currentHTML,
  anamnesisType,
  setSelectedAnamnesisTypes
}) => {
  const richText = useRef<any>(undefined);
  const dimensions = useWindowDimensions();
  const [firstRender, setFirstRender] = useState<boolean>(false);

  useEffect(() => {
    if (currentHTML !== '' && !firstRender) {
      richText?.current.setContentHTML(currentHTML);
      setFirstRender(true);
    }
  }, [currentHTML, firstRender]);

  useEffect(() => {}, []);
  return (
    <>
      <SafeAreaView style={{ marginHorizontal: 4, marginVertical: 20 }}>
        <ScrollView>
          <Text style={[styles.label, { maxWidth: dimensions.width * 0.8 }]}>{label}</Text>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={[styles.editorStyleContainer, { maxWidth: dimensions.width * 0.8 }]}
          >
            <RichEditor
              ref={richText}
              onChange={(descriptionText) => {
                setFirstRender(true);
                currentHTML = descriptionText;
                setSelectedAnamnesisTypes((curSelected) => {
                  const selectedType = curSelected.find(
                    (s) => s.anamnesisTypeId === anamnesisType.anamnesisTypeId
                  );
                  if (selectedType) {
                    selectedType.template = descriptionText;
                  }
                  return curSelected;
                });
              }}
              onBlur={() => {}}
              editorStyle={styles.editorStyle}
              initialHeight={350}
              initialContentHTML={currentHTML}
            />
          </KeyboardAvoidingView>
        </ScrollView>

        <RichToolbar
          style={[{ maxWidth: dimensions.width * 0.8 }]}
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
      </SafeAreaView>
    </>
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
    borderRadius: 5,
    flex: 1
  },
  editorStyle: {
    backgroundColor: Colors.primary100
  }
});

export default RichTextAnamnesisInput;
