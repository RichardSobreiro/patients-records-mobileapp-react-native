import { Colors } from '../../constants/styles';
import { Ionicons } from '@expo/vector-icons';
import React, { FC, ReactElement, useRef, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, Modal, View } from 'react-native';

export type DropdownData = { label: string; value: string };

interface Props {
  field?;
  label?;
  values?;
  touched?;
  errors?;
  onChangeHandler: (field: string, value: any) => void;
  data: DropdownData[] | undefined;
}

const Dropdown: FC<Props> = ({ field, label, values, touched, errors, onChangeHandler, data }) => {
  const DropdownButton = useRef<TouchableOpacity | null>(null);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState<DropdownData | undefined>(undefined);
  const [dropdownTop, setDropdownTop] = useState(0);
  const [overlayWidth, setOverlayWidth] = useState(0);
  const [overlayXPosition, setOverlayXPosition] = useState(0);

  const toggleDropdown = (): void => {
    // eslint-disable-next-line no-unused-expressions
    visible ? setVisible(false) : openDropdown();
  };

  const openDropdown = (): void => {
    DropdownButton.current!.measure((_fx, _fy, _w, h, _px, py) => {
      setDropdownTop(py + h);
      setOverlayWidth(_w);
      setOverlayXPosition(_px);
    });
    setVisible(true);
  };

  const onItemPress = (item): void => {
    setSelected(item);
    //onSelect(item);
    onChangeHandler(field, item.value);
    setVisible(false);
  };

  const renderItem = ({ item }): ReactElement<any, any> => (
    <TouchableOpacity style={styles.item} onPress={() => onItemPress(item)}>
      <Text>{item.label}</Text>
    </TouchableOpacity>
  );

  const renderDropdown = (): ReactElement<any, any> => {
    return (
      <Modal visible={visible} transparent animationType="none">
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
    <TouchableOpacity ref={DropdownButton} style={styles.button} onPress={toggleDropdown}>
      {touched[field] && errors[field] ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errors[field]}</Text>
        </View>
      ) : null}
      {renderDropdown()}
      <Text style={styles.buttonText}>{selected?.label ?? label}</Text>
      <Ionicons style={styles.icon} size={25} name="chevron-down" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary100,
    minHeight: 50,
    zIndex: 1,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#e3e3e3'
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
    backgroundColor: '#ffffff',
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
    borderBottomWidth: 1
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    color: '#ff7675'
  }
});

export default Dropdown;
