/* eslint-disable import/order */
import { Colors } from '../../constants/styles';
import IconButton from '../ui/IconButton';
import Filters from './Filters';
import { Feather, Entypo } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, TextInput, View, Keyboard, Modal, Alert } from 'react-native';

type Props = {
  clicked;
  searchPhrase;
  setSearchPhrase;
  setClicked;
  setAdvancedFilters;
};

const SearchBar: React.FC<Props> = ({
  clicked,
  searchPhrase,
  setSearchPhrase,
  setClicked,
  setAdvancedFilters
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  return (
    <>
      <View style={styles.centeredModalView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
            setModalVisible(false);
          }}
        >
          <Filters setModalVisible={setModalVisible} setAdvancedFilters={setAdvancedFilters} />
        </Modal>
      </View>
      <View style={styles.container}>
        <View style={clicked ? styles.searchBar__clicked : styles.searchBar__unclicked}>
          {/* search Icon */}
          <Feather name="search" size={20} color="#000000" style={{ marginLeft: 1 }} />
          {/* Input field */}
          <TextInput
            style={styles.input}
            placeholder="Search"
            value={searchPhrase}
            onChangeText={setSearchPhrase}
            onFocus={() => {
              setClicked(true);
            }}
          />
          {/* cross Icon, depending on whether the search bar is clicked or not */}
          {clicked && (
            <Entypo
              name="cross"
              size={20}
              color="#000000"
              style={{ padding: 1 }}
              onPress={() => {
                setSearchPhrase('');
              }}
            />
          )}
        </View>
        {/* cancel button, depending on whether the search bar is clicked or not */}
        {clicked && (
          <View>
            <IconButton
              icon="filter"
              color={Colors.primary800}
              size={30}
              onPress={() => {
                Keyboard.dismiss();
                setModalVisible(true);
              }}
              pressable={{ borderColor: '#000000', borderWidth: 2, padding: 4, borderRadius: 10 }}
            ></IconButton>
            <IconButton
              icon="close"
              color={Colors.primary800}
              size={30}
              onPress={() => {
                Keyboard.dismiss();
                setClicked(false);
              }}
              pressable={{ borderColor: '#000000', borderWidth: 2, padding: 4, borderRadius: 10 }}
            ></IconButton>
          </View>
        )}
      </View>
    </>
  );
};
export default SearchBar;

// styles
const styles = StyleSheet.create({
  centeredModalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22
  },
  container: {
    marginHorizontal: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%',
    minHeight: 100
  },
  searchBar__unclicked: {
    padding: 10,
    flexDirection: 'row',
    width: '95%',
    backgroundColor: '#d9dbda',
    borderRadius: 15,
    alignItems: 'center'
  },
  searchBar__clicked: {
    padding: 10,
    flexDirection: 'row',
    width: '80%',
    backgroundColor: '#d9dbda',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'space-evenly'
  },
  input: {
    fontSize: 20,
    marginLeft: 10,
    width: '90%'
  }
});
