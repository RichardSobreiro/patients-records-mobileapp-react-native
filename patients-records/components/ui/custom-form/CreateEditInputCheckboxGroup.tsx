/* eslint-disable import/order */
import { Colors } from '../../../constants/styles';
import { GetAnamnesisTypeByIdResponse } from '../../../models/customers/anamnesis-types/GetAnamnesisTypeByIdResponse';
import IconButton from '../IconButton';
import React, { FC, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import { Checkbox } from 'react-native-paper';

export type CheckboxItem = { label: string; value: string };
type CheckboxItemState = { label: string; value: string; checked: boolean; visible: boolean };

interface Props {
  field: string;
  label: string;
  questionPhrase: string;
  onChangeHandlerQuestionPhrase: (field: string, value: any) => void;
  onChangeHandlerAnswerQuestionOption: (field: string, newValue: string, oldValue: string) => void;
  anamnesisType: GetAnamnesisTypeByIdResponse;
  onChangeHandlerAddAnswerQuestionOption: (field: string, newAnswerValue: string) => void;
  onChangeHandlerRemoveAnswerQuestionOption: (field: string, answerValue: string) => void;
}

const CreateEditInputCheckboxGroup: FC<Props> = ({
  field,
  label,
  questionPhrase,
  onChangeHandlerQuestionPhrase,
  onChangeHandlerAnswerQuestionOption,
  anamnesisType,
  onChangeHandlerAddAnswerQuestionOption,
  onChangeHandlerRemoveAnswerQuestionOption
}) => {
  const [list, setList] = useState<CheckboxItemState[]>([]);

  const [visibleAddCheckbox, setVisibleAddCheckbox] = useState<boolean>(false);
  const [newCheckboxAnswerOption, setNewCheckboxAnswerOption] = useState<string>('');

  useEffect(() => {
    if (anamnesisType.questions) {
      const question = anamnesisType.questions!.find((q) => q.questionItemId === field);
      if (question) {
        const newList = question?.questionAnswersOptions!.map((item) => {
          return {
            label: item,
            value: item,
            checked: false,
            visible: true
          };
        });
        setList(newList);
      }
    }
  }, [field, anamnesisType]);

  const renderItem = ({ item, index }) => {
    return (
      item.visible && (
        <View key={index} style={styles.listItemContainer}>
          <View style={styles.listItemContent}>
            <Checkbox status={item.checked ? 'checked' : 'unchecked'} onPress={() => {}} />
            <TextInput
              value={item.label}
              onChangeText={(text) => {
                onChangeHandlerAnswerQuestionOption(field, text, item.label);
              }}
              returnKeyType="next"
            />
          </View>
          <View style={styles.listItemContent}>
            <IconButton
              pressable={{ paddingHorizontal: 10 }}
              icon={'close'}
              color={Colors.primary500}
              size={24}
              onPress={() => {
                onChangeHandlerRemoveAnswerQuestionOption(field, item.label);
                setList((curList) => {
                  return curList!.filter((i) => i.label !== item.label);
                });
              }}
              label=""
            />
          </View>
        </View>
      )
    );
  };

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
      <View style={[{ flex: 1, alignItems: 'flex-start', marginBottom: 10 }]}>
        <Text style={styles.labelQuestion}>{label}</Text>
      </View>

      <TextInput
        style={[styles.label]}
        value={questionPhrase}
        onChangeText={(text) => onChangeHandlerQuestionPhrase(field, text)}
        returnKeyType="next"
        placeholder="Nova Pergunta..."
      />

      <View style={[styles.listContent, Platform.OS === 'ios' ? { gap: 20 } : null]}>
        {list.map((item, index) => {
          return renderItem({ item, index });
        })}
      </View>
      {visibleAddCheckbox && (
        <View style={styles.listItemContentAdding}>
          <Checkbox status={'unchecked'} onPress={() => {}} />
          <TextInput
            value={newCheckboxAnswerOption}
            onChangeText={(text) => {
              setNewCheckboxAnswerOption(text);
            }}
            returnKeyType="next"
            placeholder={'Nova opção...'}
          />
        </View>
      )}
      {visibleAddCheckbox ? (
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <IconButton
            pressable={{ paddingHorizontal: 10 }}
            icon={'close'}
            color={Colors.primary500}
            size={24}
            onPress={() => setVisibleAddCheckbox(false)}
            label="Cancelar"
          />
          <IconButton
            pressable={{ paddingHorizontal: 10, borderColor: Colors.secondary800 }}
            icon={'add'}
            color={Colors.secondary500}
            size={24}
            onPress={() => {
              onChangeHandlerAddAnswerQuestionOption(field, newCheckboxAnswerOption);
              setList((curList) => {
                curList!.push({
                  label: newCheckboxAnswerOption,
                  value: newCheckboxAnswerOption,
                  checked: false,
                  visible: true
                });
                return curList;
              });
              setNewCheckboxAnswerOption('');
              setVisibleAddCheckbox(false);
            }}
            label="Adicionar"
            labelStyle={{ color: Colors.secondary500 }}
          />
        </View>
      ) : (
        <IconButton
          icon={'add'}
          color={Colors.primary500}
          size={24}
          onPress={() => setVisibleAddCheckbox(true)}
          label="Adicionar opção de resposta"
        />
      )}
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
  label: {
    fontSize: 18,
    color: Colors.primary500,
    marginBottom: 4
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    zIndex: 1,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: Colors.primary500,
    padding: 6
  },
  buttonText: {
    flex: 1,
    textAlign: 'center',
    color: Colors.primary800,
    fontSize: 16
  },
  icon: {
    marginRight: 10
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: Colors.primary100,
    width: '100%',
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.5
  },
  overlay: {
    width: '100%',
    height: '100%'
  },
  item: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Colors.primary500
  },
  itemText: {
    color: Colors.primary800
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    color: '#ff7675'
  },
  topBarActions: {
    width: '100%',
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center'
  },
  topBarActionsLeftContent: {
    flex: 5
  },
  topBarActionsRightContent: {
    flex: 1
  },
  listContent: {
    width: '100%'
  },
  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  listItemContentAdding: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.primary800,
    marginVertical: 10,
    borderStyle: 'dotted'
  }
});

export default CreateEditInputCheckboxGroup;
