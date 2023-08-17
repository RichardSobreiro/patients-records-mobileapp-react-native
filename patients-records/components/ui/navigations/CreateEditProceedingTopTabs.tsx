import AfterPhotosScreen from '../../../screens/services/AfterPhotosScreen';
import SaveServiceScreen from '../../../screens/services/SaveServiceScreen';
import Step1ServiceInfoScreen from '../../../screens/services/Step1ServiceInfoScreen';
import Step2BeforeServiceScreen from '../../../screens/services/Step2BeforeServiceScreen';
import CreateEditProceedingProvider from '../../../store/create-edit-proceedings-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

export type TopBarCreateEditProceedingParamList = {
  ProceedingInfoScreen;
  Step2BeforeServiceScreen;
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
            <Step1ServiceInfoScreen route={route} navigation={navigation} proceeding={proceeding} />
          )}
        </ProceedingTopTabs.Screen>
        <ProceedingTopTabs.Screen
          name="Step2BeforeServiceScreen"
          options={{
            tabBarLabel: 'Fotos do Antes'
          }}
        >
          {({ route, navigation }) => (
            <Step2BeforeServiceScreen
              route={route}
              navigation={navigation}
              proceeding={proceeding}
            />
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
