/* eslint-disable import/order */
import { Colors } from '../../constants/styles';
import StackSheetCustom from './custom-form/StackSheetCustom';

import { Ionicons } from '@expo/vector-icons';
import React, { FC, useEffect, useRef, useState } from 'react';
import { FlatList, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Checkbox, Searchbar } from 'react-native-paper';

export type DropdownData = { label: string; value: string };
type DropdownDataState = { label: string; value: string; checked: boolean; visible: boolean };

interface Props {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
  field: string;
  label: string;
  values?;
  touched?;
  errors?;
  onChangeHandler: (field: string, value: any) => void;
  data: DropdownData[];
}

const DropdownModal: FC<Props> = ({
  visible,
  setVisible,
  field,
  label,
  values,
  touched,
  errors,
  onChangeHandler,
  data
}) => {
  const DropdownButton = useRef<TouchableOpacity | null>(null);
  const [selected, setSelected] = useState<DropdownData | undefined>(undefined);
  const [list, setList] = useState<DropdownDataState[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

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

      <TouchableOpacity ref={DropdownButton} style={styles.button} onPress={() => setVisible(true)}>
        <Text style={styles.buttonText}>{selected?.label ?? `Selecionar...`}</Text>
        <Ionicons style={styles.icon} size={25} name="chevron-down" />
      </TouchableOpacity>

      <StackSheetCustom
        visible={visible}
        setVisible={setVisible}
        positiveActionLabel={''}
        saveModalCallback={() => setVisible(false)}
      >
        <View style={styles.topBarActions}>
          <View style={styles.topBarActionsLeftContent}>
            <Searchbar
              placeholder="Procurar"
              onChangeText={(text) => {
                setSearchQuery(text);
                setList((curList) => {
                  const newList = [...curList];
                  if (text === '') {
                    newList.forEach((elem) => {
                      elem.visible = true;
                    });
                  } else {
                    newList.forEach((elem) => {
                      if (elem.label.toLowerCase().includes(text.toLowerCase())) {
                        elem.visible = true;
                      } else {
                        elem.visible = false;
                      }
                    });
                  }
                  return newList;
                });
              }}
              value={searchQuery}
            />
          </View>
        </View>
        <FlatList
          scrollEnabled={true}
          data={list}
          renderItem={renderItem}
          contentContainerStyle={[styles.listContent, Platform.OS === 'ios' ? { gap: 20 } : null]}
          keyExtractor={(item) => item.value}
          showsVerticalScrollIndicator={true}
        />
      </StackSheetCustom>
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

export default DropdownModal;
