/* eslint-disable import/order */
import { Colors } from '../../../constants/styles';
import React, { FC, useEffect, useState } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Checkbox } from 'react-native-paper';

export type CheckboxItem = { label: string; value: string };
type CheckboxItemState = { label: string; value: string; checked: boolean; visible: boolean };

interface Props {
  field: string;
  label: string;
  values?;
  touched?;
  errors?;
  onChangeHandler: (field: string, value: any) => void;
  data: CheckboxItem[];
}

const InputCheckboxGroup: FC<Props> = ({
  field,
  label,
  values,
  touched,
  errors,
  onChangeHandler,
  data
}) => {
  const [, setSelected] = useState<CheckboxItem | undefined>(undefined);
  const [list, setList] = useState<CheckboxItemState[]>([]);

  useEffect(() => {
    setList(
      data.map((item) => {
        if (item.value === values[field].value) {
          setSelected(item);
        }
        return {
          label: item.label,
          value: item.value,
          checked: item.value === values[field].value,
          visible: true
        };
      })
    );
  }, [data, field, values]);

  const renderItem = ({ item, index }) => {
    return (
      item.visible && (
        <View key={index} style={styles.listItemContent}>
          <Checkbox
            status={item.checked ? 'checked' : 'unchecked'}
            onPress={() => {
              setList((curList) => {
                const newList = [...curList];
                newList.forEach((elem) => {
                  if (elem.value === item.value) {
                    elem.checked = true;
                    setSelected(elem);
                    onChangeHandler(field, item.value);
                  } else {
                    elem.checked = false;
                  }
                });
                return newList;
              });
            }}
          />
          <Text>{item.label}</Text>
        </View>
      )
    );
  };

  return (
    <View style={{ marginTop: 15 }}>
      <View style={[{ flex: 1, alignItems: 'flex-start', marginBottom: 10 }]}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <View style={[styles.listContent, Platform.OS === 'ios' ? { gap: 20 } : null]}>
        {list.map((item, index) => {
          return renderItem({ item, index });
        })}
      </View>
      {/* <FlatList
        scrollEnabled={true}
        data={list}
        renderItem={renderItem}
        contentContainerStyle={[styles.listContent, Platform.OS === 'ios' ? { gap: 20 } : null]}
        keyExtractor={(item) => item.serviceTypeId}
        showsVerticalScrollIndicator={true}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
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
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%'
  }
});

export default InputCheckboxGroup;
