/* eslint-disable import/order */
import { Colors } from '../../constants/styles';
import AnamnesisListScreen from '../Patients/AnamnesisScreens/AnamnesisListScreen';
import CreateAnamnesisScreen from '../Patients/AnamnesisScreens/CreateAnamnesisScreen';
import CreateAnamnesisTypeScreen from '../Patients/AnamnesisScreens/CreateAnamnesisTypeScreen';
import EditAnamnesisScreen from '../Patients/AnamnesisScreens/EditAnamnesisScreen';
import EditAnamnesisTypeScreen from '../Patients/AnamnesisScreens/EditAnamnesisTypeScreen';

import { AntDesign } from '@expo/vector-icons';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { TouchableOpacity } from 'react-native';

export type RootStackAnamnesisCrudParamList = {
  AnamnesisList: { customerId: string; updateList?: boolean };
  EditAnamnesis: { customerId: string; anamnesisId: string; showCreatedSnackbar?: boolean };
  CreateAnamnesis: { customerId: string };
  EditAnamnesisType: { anamnesisTypeId: string; showCreatedSnackbar?: boolean };
  CreateAnamnesisType;
};

const StackAnamnesisCrud = createNativeStackNavigator<RootStackAnamnesisCrudParamList>();

const AnamnesisCrudStackComp = ({ route, navigation }) => {
  const { customerId, anamnesisId, anamnesisTypeId } = route.params;

  return (
    <StackAnamnesisCrud.Navigator
      screenOptions={{
        contentStyle: { backgroundColor: Colors.primary100 }
      }}
    >
      <StackAnamnesisCrud.Screen
        name="AnamnesisList"
        component={AnamnesisListScreen}
        initialParams={{ customerId }}
        options={{
          headerShown: false
        }}
      />
      <StackAnamnesisCrud.Screen
        name="CreateAnamnesis"
        component={CreateAnamnesisScreen}
        initialParams={{ customerId }}
        options={{
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity>
              <AntDesign
                style={{ paddingLeft: 0, paddingRight: 30 }}
                name="arrowleft"
                size={24}
                color={Colors.primary500}
                onPress={() => {
                  navigation.setOptions({
                    headerShown: false
                  });
                  navigation.replace('AnamnesisList', { customerId });
                }}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: 'transparent'
          },
          headerShadowVisible: false
        }}
      />
      <StackAnamnesisCrud.Screen
        name="EditAnamnesis"
        component={EditAnamnesisScreen}
        initialParams={{ customerId, anamnesisId }}
        options={{
          headerTitle: '',
          headerLeft: () => (
            <TouchableOpacity>
              <AntDesign
                style={{ paddingLeft: 0, paddingRight: 30 }}
                name="arrowleft"
                size={24}
                color={Colors.primary500}
                onPress={() => {
                  navigation.setOptions({
                    headerShown: false
                  });
                  navigation.replace('AnamnesisList', { customerId });
                }}
              />
            </TouchableOpacity>
          ),
          headerStyle: {
            backgroundColor: 'transparent'
          },
          headerShadowVisible: false
        }}
      />
      <StackAnamnesisCrud.Screen
        name="EditAnamnesisType"
        component={EditAnamnesisTypeScreen}
        initialParams={{ anamnesisTypeId }}
        options={{
          headerTitle: '',
          headerStyle: {
            backgroundColor: 'transparent'
          },
          headerShadowVisible: false
        }}
      />
      <StackAnamnesisCrud.Screen
        name="CreateAnamnesisType"
        component={CreateAnamnesisTypeScreen}
        options={{
          headerTitle: '',
          headerTitleStyle: {
            color: Colors.primary500
          },
          headerStyle: {
            backgroundColor: 'transparent'
          },
          headerShadowVisible: false
        }}
      />
    </StackAnamnesisCrud.Navigator>
  );
};

export default AnamnesisCrudStackComp;
