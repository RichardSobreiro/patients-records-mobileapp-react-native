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
            <ProceedingsInfoScreen route={route} navigation={navigation} proceeding={proceeding} />
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
          name="SaveProceedingScreen"
          options={{
            tabBarLabel: 'Salvar'
          }}
        >
          {({ route, navigation }) => (
            <SaveProceedingScreen route={route} navigation={navigation} proceeding={proceeding} />
          )}
        </ProceedingTopTabs.Screen>
      </ProceedingTopTabs.Navigator>
    </CreateEditProceedingProvider>
  );
};

export default CreateEditProceedingTopTabs;
