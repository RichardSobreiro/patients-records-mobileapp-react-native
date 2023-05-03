import { FontAwesome5 } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

type Props = { label; iconName; iconColor; isActive; setActive };

const GenderSelection: React.FC<Props> = ({ label, iconName, iconColor, isActive, setActive }) => {
  return (
    <TouchableOpacity
      style={[
        styles.box,
        {
          backgroundColor: isActive ? '#24263b' : '#323344'
        }
      ]}
      onPress={setActive}
    >
      <FontAwesome5 name={iconName} size={80} color={iconColor} />
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  box: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#323344',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 10
  },
  label: {
    fontSize: 15,
    textAlign: 'center',
    color: '#848694',
    marginTop: 10
  }
});

export default React.memo(GenderSelection);
