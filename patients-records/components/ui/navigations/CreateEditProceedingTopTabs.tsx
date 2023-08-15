import AfterPhotosScreen from '../../../screens/services/AfterPhotosScreen';
import BeforePhotosScreen from '../../../screens/services/BeforePhotosScreen';
import SaveServiceScreen from '../../../screens/services/SaveServiceScreen';
import ServicesInfoScreen from '../../../screens/services/ServicesInfoScreen';
import CreateEditProceedingProvider from '../../../store/create-edit-proceedings-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

export type TopBarCreateEditProceedingParamList = {
  ProceedingInfoScreen;
  BeforePhotosScreen;
  AfterPhotosScreen;
  SaveServiceScreen;
};

const ProceedingTopTabs = createMaterialTopTabNavigator<TopBarCreateEditProceedingParamList>();

const CreateEditProceedingTopTabs = ({ route, navigation }) => {
  const { patient, proceeding } = route.params;

  // Fix the empty photos array when saving proceeding without modification

  return (
    <CreateEditProceedingProvider patientInitialValue={patient} proceedingInitialValue={proceeding}>
      <ProceedingTopTabs.Navigator>
        <ProceedingTopTabs.Screen
          name="ProceedingInfoScreen"
          options={{
            tabBarLabel: 'Dados'
          }}
        >
          {({ route, navigation }) => (
            <ServicesInfoScreen route={route} navigation={navigation} proceeding={proceeding} />
          )}
        </ProceedingTopTabs.Screen>
        <ProceedingTopTabs.Screen
          name="BeforePhotosScreen"
          options={{
            tabBarLabel: 'Fotos do Antes'
          }}
        >
          {({ route, navigation }) => (
            <BeforePhotosScreen route={route} navigation={navigation} proceeding={proceeding} />
          )}
        </ProceedingTopTabs.Screen>
        <ProceedingTopTabs.Screen
          name="AfterPhotosScreen"
          options={{
            tabBarLabel: 'Fotos do Depois'
          }}
        >
          {({ route, navigation }) => (
            <AfterPhotosScreen route={route} navigation={navigation} proceeding={proceeding} />
          )}
        </ProceedingTopTabs.Screen>
        <ProceedingTopTabs.Screen
          name="SaveServiceScreen"
          options={{
            tabBarLabel: 'Salvar'
          }}
        >
          {({ route, navigation }) => (
            <SaveServiceScreen route={route} navigation={navigation} proceeding={proceeding} />
          )}
        </ProceedingTopTabs.Screen>
      </ProceedingTopTabs.Navigator>
    </CreateEditProceedingProvider>
  );
};

export default CreateEditProceedingTopTabs;
