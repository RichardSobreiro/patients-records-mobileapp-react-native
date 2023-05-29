/* eslint-disable import/order */
import { Colors } from '../../../../constants/styles';
import { CreateEditProceedingContext } from '../../../../store/create-edit-proceedings-context';
import Button, { ButtonTypes } from '../../../ui/Button';
import DatePicker from '../../../ui/custom-form/DatePicker';
import Input from '../../../ui/custom-form/Input';
import { TopBarCreateEditProceedingParamList } from '../../../ui/navigations/CreateEditProceedingTopTabs';
import PatientPhotos from '../PatientPhotos';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { MaterialTopTabNavigationProp } from '@react-navigation/material-top-tabs';
import { useNavigation } from '@react-navigation/native';
import { EditPatientStackParamList } from 'App';
import { useContext, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SaveProceeding: React.FC = () => {
  const navigationEditPatient = useNavigation<BottomTabNavigationProp<EditPatientStackParamList>>();
  const navigationCreateEditProceeding =
    useNavigation<MaterialTopTabNavigationProp<TopBarCreateEditProceedingParamList>>();
  const createEditProceedingCtx = useContext(CreateEditProceedingContext);

  useEffect(() => {
    createEditProceedingCtx.validate(undefined);
  }, [createEditProceedingCtx]);

  return (
    <KeyboardAwareScrollView
      style={styles.content}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.patientInfoContainer}>
        <View style={{ flex: 1, marginRight: 5 }}>
          <Button
            type={ButtonTypes.Cancel}
            onPress={() => {
              navigationEditPatient.navigate('ProceedingsList', {
                patient: createEditProceedingCtx.patient!
              });
            }}
            text={{ fontSize: 18 }}
          >
            {createEditProceedingCtx.isEditing ? 'Voltar' : 'Cancelar'}
          </Button>
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <Button
            type={ButtonTypes.Primary}
            onPress={createEditProceedingCtx.submitHandler.bind(
              null,
              navigationCreateEditProceeding
            )}
            text={{ fontSize: 18 }}
          >
            Salvar
          </Button>
        </View>
      </View>
      <DatePicker
        field="date"
        label="Data do Procedimento"
        values={createEditProceedingCtx.inputs}
        touched={createEditProceedingCtx.touched}
        errors={createEditProceedingCtx.errors}
        onPress={() => {
          navigationCreateEditProceeding.navigate('ProceedingInfoScreen');
        }}
      />
      <TouchableOpacity
        onPress={() => {
          navigationCreateEditProceeding.navigate('ProceedingInfoScreen');
        }}
      >
        <Input
          field="type"
          label="Tipo"
          values={createEditProceedingCtx.inputs}
          touched={createEditProceedingCtx.touched}
          errors={createEditProceedingCtx.errors}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          navigationCreateEditProceeding.navigate('ProceedingInfoScreen');
        }}
      >
        <Input
          field="notes"
          label="Observações Gerais"
          values={createEditProceedingCtx.inputs}
          touched={createEditProceedingCtx.touched}
          errors={createEditProceedingCtx.errors}
          textInputConfig={{ multiline: true }}
        />
      </TouchableOpacity>
      <View style={{ marginBottom: 40 }}>
        <PatientPhotos
          field="beforePhotos"
          title="Fotos do Antes"
          values={createEditProceedingCtx.inputs}
        />
        <PatientPhotos
          field="afterPhotos"
          title="Fotos do Depois"
          values={createEditProceedingCtx.inputs}
        />
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SaveProceeding;

const styles = StyleSheet.create({
  patientInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    marginBottom: 50,
    marginTop: 15
  },
  patientInfoText: {
    fontSize: 24,
    textAlign: 'center'
  },
  content: {
    backgroundColor: Colors.primary800,
    marginTop: 20,
    marginBottom: 15,
    marginHorizontal: 32,
    padding: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: '#000000',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4
  }
});
