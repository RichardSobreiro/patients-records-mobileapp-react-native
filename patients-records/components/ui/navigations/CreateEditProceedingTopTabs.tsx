import AfterPhotosScreen from '../../../screens/Proceedings/AfterPhotosScreen';
import BeforePhotosScreen from '../../../screens/Proceedings/BeforePhotosScreen';
import ProceedingsInfoScreen from '../../../screens/Proceedings/ProceedingsInfoScreen';
import SaveProceedingScreen from '../../../screens/Proceedings/SaveProceedingScreen';
import CreateEditProceedingProvider from '../../../store/create-edit-proceedings-context';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

export type TopBarCreateEditProceedingParamList = {
  ProceedingInfoScreen;
  BeforePhotosScreen;
  AfterPhotosScreen;
  SaveProceedingScreen;
};

const ProceedingTopTabs = createMaterialTopTabNavigator<TopBarCreateEditProceedingParamList>();

const CreateEditProceedingTopTabs = ({ route, navigation }) => {
  const { patient, proceeding } = route.params;

  // Reinitialize INPUTS when proceeding === null

  // Validate just the input touched

  // Fix the empty photos array when saving proceeding without modification

  return (
    <CreateEditProceedingProvider patientInitialValue={patient} proceedingInitialValue={proceeding}>
      <ProceedingTopTabs.Navigator>
        <ProceedingTopTabs.Screen
          name="ProceedingInfoScreen"
          component={ProceedingsInfoScreen}
          options={{
            tabBarLabel: 'Dados'
          }}
        />
        <ProceedingTopTabs.Screen
          name="BeforePhotosScreen"
          component={BeforePhotosScreen}
          options={{
            tabBarLabel: 'Fotos do Antes'
          }}
        />
        <ProceedingTopTabs.Screen
          name="AfterPhotosScreen"
          component={AfterPhotosScreen}
          options={{
            tabBarLabel: 'Fotos do Depois'
          }}
        />
        <ProceedingTopTabs.Screen
          name="SaveProceedingScreen"
          component={SaveProceedingScreen}
          options={{
            tabBarLabel: 'Salvar'
          }}
        />
      </ProceedingTopTabs.Navigator>
    </CreateEditProceedingProvider>
  );
};

export default CreateEditProceedingTopTabs;
