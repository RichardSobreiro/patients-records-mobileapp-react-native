import { Colors } from '../../../constants/styles';
import IconButton from '../../ui/IconButton';
import { Feather, Entypo } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View, Keyboard } from 'react-native';

type Props = { clicked; searchPhrase; setSearchPhrase; setClicked };

const ProceedingsListSearchBar: React.FC<Props> = ({
  clicked,
  searchPhrase,
  setSearchPhrase,
  setClicked
}) => {
  return (
    <View style={styles.container}>
      <View style={clicked ? styles.searchBar__clicked : styles.searchBar__unclicked}>
        {/* search Icon */}
        <Feather name="search" size={20} color="black" style={{ marginLeft: 1 }} />
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
            color="black"
            style={{ padding: 1 }}
            onPress={() => {
              setSearchPhrase('');
            }}
          />
        )}
      </View>
      {clicked && (
        <View>
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
  );
};
export default ProceedingsListSearchBar;

// styles
const styles = StyleSheet.create({
  container: {
    margin: 15,
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'row',
    width: '90%'
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
