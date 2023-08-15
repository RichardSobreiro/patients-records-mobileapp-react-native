import { Colors } from '../../constants/styles';
import { Feather } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';

type Props = {
  isWelcomeScreen?: boolean;
  isAddingCustomerScreen?: boolean;
  onNavigateToCreateCustomer?: () => void;
  onSkipBackPressed?: () => void;
  title?: string;
  subtitle?: string;
};

const Header: React.FC<Props> = ({
  isWelcomeScreen,
  isAddingCustomerScreen,
  onNavigateToCreateCustomer,
  onSkipBackPressed,
  title,
  subtitle
}) => {
  return (
    <>
      {isWelcomeScreen && (
        <>
          <TouchableOpacity onPress={onNavigateToCreateCustomer}>
            <Feather name="user-plus" size={40} color={'#ffffff'} />
          </TouchableOpacity>

          {title && (
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{title}</Text>
              {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
            </View>
          )}

          <TouchableOpacity>
            <Feather name="settings" size={40} color={'#ffffff'} />
          </TouchableOpacity>
        </>
      )}
      {isAddingCustomerScreen && (
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
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
    alignContent: 'center',
    color: '#ffffff',
    backgroundColor: Colors.primary800
  },
  skipBackIcon: {
    alignSelf: 'flex-start'
  },
  titleContainer: {
    //borderBottomWidth: 1
    //borderBottomColor: '#dbdbdb'
  },
  title: {
    textAlign: 'center',
    fontSize: 25,
    color: '#ffffff',
    //marginLeft: 12,
    paddingLeft: 8,
    fontWeight: 'bold'
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 15,
    color: '#ffffff',
    //marginLeft: 12,
    paddingLeft: 8,
    fontWeight: 'bold'
  }
});
