//import { styles } from './styles';
import FlatButton from './FlatButton';
import { AntDesign } from '@expo/vector-icons';
import { DropdownMultiselectView } from 'expo-dropdown-multiselect';
import { useEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View } from 'react-native';

export type ItemData = { key: number; value: string };

type Props = {
  label: string;
  data: ItemData[];
  field?;
  values?;
  touched?;
  errors?;
  handleChange?;
  handleBlur?;
  isValid;
  isFormValid;
};

const FormFieldSelect: React.FC<Props> = ({
  label,
  data,
  touched,
  errors,
  field,
  values,
  isValid,
  isFormValid
}) => {
  const [selectedItems, setSelectedItems] = useState<ItemData[]>([]);

  useEffect(() => {
    const keys = values[field].map((item) => item.key);
    // if (keys && keys.length > 0) {
    //   touched[field] = true;
    // }
    setSelectedItems(keys);
  }, [values, field, touched]);

  const removeSelectedItem = (item) => {
    setSelectedItems((prevState) => {
      values[field] = values[field].filter((selectedItem) => selectedItem.key !== item.key);
      isFormValid();
      return prevState.filter((d) => d !== item.key);
    });
  };

  const addSelectedItem = (itemsKey) => {
    setSelectedItems((prevState) => {
      values[field] = data.filter((d) => itemsKey.includes(d.key));
      isFormValid();
      return itemsKey;
    });
  };

  return (
    <SafeAreaView style={styles.formGroup}>
      <Text style={styles.label}>{label}</Text>
      <DropdownMultiselectView
        selectContainer={[
          styles.selectContainer,
          {
            opacity: isFormValid(values, isValid, touched) ? 1 : 0.5
          }
        ]}
        data={data}
        displayKey="value"
        displayValue="key"
        selectedItem={selectedItems}
        setSelectedItem={addSelectedItem}
      />
      <View style={styles.selectedContainer}>
        {selectedItems.map((itemKey) => {
          const item: ItemData = data.find((d) => d.key === (itemKey as unknown as number))!;
          return (
            item && (
              <FlatButton key={item.key} onPress={removeSelectedItem.bind(null, item)}>
                <View style={styles.selectedItemContainer}>
                  <View style={styles.selectedItemName}>
                    <Text>{item.value}</Text>
                  </View>
                  <View style={styles.selectedItemIcon}>
                    <AntDesign name="closecircleo" size={16} color="black" />
                  </View>
                </View>
              </FlatButton>
            )
          );
        })}
        {touched[field] && errors[field] ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors[field]}</Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

export default FormFieldSelect;

const styles = StyleSheet.create({
  selectContainer: {
    backgroundColor: '#fff',
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#e3e3e3'
  },
  selectedContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap'
  },
  selectedItemContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center',
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#e3e3e3',
    backgroundColor: '#fff',
    padding: 4
  },
  selectedItemIcon: {
    margin: 1,
    padding: 2,
    justifyContent: 'center',
    alignContent: 'center'
  },
  selectedItemName: {
    margin: 1,
    padding: 2,
    justifyContent: 'center',
    alignContent: 'center'
  },
  formGroup: {
    marginBottom: 10
  },
  label: {
    color: '#7d7e79',
    fontSize: 16,
    lineHeight: 30
  },
  input: {
    height: 50,
    paddingHorizontal: 20,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: '#e3e3e3',
    backgroundColor: '#fff'
  },
  errorContainer: {
    marginVertical: 5
  },
  errorText: {
    color: '#ff7675'
  }
});
