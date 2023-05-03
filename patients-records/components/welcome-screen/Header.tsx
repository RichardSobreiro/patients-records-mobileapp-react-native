import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

type Props = {
  isWelcomeScreen?: boolean;
  isAddingPatientScreen?: boolean;
  onCreateEditPatient?: () => void;
  onSkipBackPressed?: () => void;
};

const Header: React.FC<Props> = ({
  isWelcomeScreen,
  isAddingPatientScreen,
  onCreateEditPatient,
  onSkipBackPressed
}) => {
  return (
    <>
      {isWelcomeScreen && (
        <>
          <TouchableOpacity onPress={onCreateEditPatient}>
            <Feather name="user-plus" size={40} />
          </TouchableOpacity>

          <TouchableOpacity>
            <Feather name="settings" size={40} />
          </TouchableOpacity>
        </>
      )}
      {isAddingPatientScreen && (
        <View style={styles.container}>
          {/* <TouchableOpacity onPress={onSkipBackPressed} style={styles.skipBackIcon}>
            <Feather name="skip-back" size={40} />
          </TouchableOpacity> */}

          <View style={styles.titleContainer}>
            <Text style={styles.title}>Novo Paciente</Text>
          </View>
        </View>
      )}
    </>
  );
};

export default Header;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignContent: 'center'
  },
  skipBackIcon: {
    alignSelf: 'flex-start'
  },
  titleContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb'
    // paddingVertical: 10,
    // paddingLeft: 8,
    //backgroundColor: '#fafafa'
  },
  title: {
    textAlign: 'center',
    fontSize: 30,
    color: '#262626',
    //marginLeft: 12,
    paddingLeft: 8,
    fontWeight: 'bold'
  }
});
