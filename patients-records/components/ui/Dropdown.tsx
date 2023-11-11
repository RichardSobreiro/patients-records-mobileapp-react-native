import { Colors } from '../../constants/styles';

import { Ionicons } from '@expo/vector-icons';
import React, { FC, ReactElement, useEffect, useRef, useState } from 'react';
import { FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export type DropdownData = { label: string; value: string };

interface Props {
  field: string;
  label: string;
  values: any;
  touched?;
  errors?;
  onChangeHandler: (field: string, value: any) => void;
  onBlurHandler?: (field: string) => void;
  data: DropdownData[] | undefined;
}

const Dropdown: FC<Props> = ({
  field,
  label,
  values,
  touched,
  errors,
  onChangeHandler,
  onBlurHandler,
  data
}) => {
  const DropdownButton = useRef<TouchableOpacity | null>(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<DropdownData | undefined>(undefined);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [overlayWidth, setOverlayWidth] = useState(0);
  const [overlayXPosition, setOverlayXPosition] = useState(0);

  useEffect(() => {
    if (values[field]?.value !== undefined && values[field].value !== '') {
      const itemSelected = data?.find((item) => item.value === values[field].value);
      if (itemSelected) {
        setSelected(itemSelected);
      }
    }
  }, [data, field, values]);

  const toggleDropdown = (): void => {
    // eslint-disable-next-line no-unused-expressions
    visible ? setVisible(false) : openDropdown();
    onBlurHandler?.(field);
  };

  const openDropdown = (): void => {
    DropdownButton.current!.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h - 24);
      setOverlayWidth(_w);
      setOverlayXPosition(_px);
    });
    setVisible(true);
  };

  const onItemPress = (item): void => {
    setSelected(item);
    onChangeHandler(field, item.value);
    setVisible(false);
  };

  const renderItem = ({ item }): ReactElement<any, any> => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text style={styles.itemText}>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = (): ReactElement<any, any> => {
    return (
      <Modal visible={visible} transparent animationType="fade">
        <TouchableOpacity
          style={[styles.overlay, { width: overlayWidth, left: overlayXPosition }]}
          onPress={() => setVisible(false)}
        >
          <View style={[styles.dropdown, { top: dropdownTop }]}>
            <FlatList
              data={data}
              renderItem={renderItem}
              keyExtractor={(item, index) => index.toString()}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    );
  };

  return (
    <View style={{ marginTop: 15 }}>
      <View style={[{ flex: 1, alignItems: 'flex-start', marginBottom: 10 }]}>
        <Text style={styles.label}>{label}</Text>
      </View>
      <TouchableOpacity ref={DropdownButton} style={styles.button} onPress={toggleDropdown}>
        {selected ? (
          <Text style={styles.buttonText}>{selected.label}</Text>
        ) : (
          <Text style={styles.buttonText}>{label}</Text>
        )}
        <Ionicons style={styles.icon} size={25} name="chevron-down" />
        {renderDropdown()}
      </TouchableOpacity>
      {errors[field] ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errors[field]}</Text>
        </View>
      ) : null}
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
  }
});

export default Dropdown;
