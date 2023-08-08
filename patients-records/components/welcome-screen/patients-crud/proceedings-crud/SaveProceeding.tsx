/* eslint-disable import/order */
import { Colors } from '../../../../constants/styles';
import { createNewProceeding, updateProceeding } from '../../../../http/ProceedingsApi';
import { AuthContext } from '../../../../store/auth-context';
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
import { useContext, useMemo } from 'react';
import { Alert, StyleSheet, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const SaveProceeding: React.FC = () => {
  const navigationEditPatient = useNavigation<BottomTabNavigationProp<EditPatientStackParamList>>();
  const navigationCreateEditProceeding =
    useNavigation<MaterialTopTabNavigationProp<TopBarCreateEditProceedingParamList>>();
  const createEditProceedingCtx = useContext(CreateEditProceedingContext);
  const authCtx = useContext(AuthContext);

  const submit = () => {
    const createUpdateProceedingRequest = {
      proceedingId: createEditProceedingCtx.inputs!.proceedingId,
      date: createEditProceedingCtx.inputs!.date.value,
      proceedingTypeDescription: createEditProceedingCtx.inputs!.type.value!,
      notes: createEditProceedingCtx.inputs!.notes.value,
      beforePhotos: createEditProceedingCtx.inputs!.beforePhotos.value,
      beforePhotosCreateNew: createEditProceedingCtx.inputs!.beforePhotos.createNew,
      afterPhotos: createEditProceedingCtx.inputs!.afterPhotos.value,
      afterPhotosCreateNew: createEditProceedingCtx.inputs!.afterPhotos.createNew
    };

    const callApi = async () => {
      let response: any;
      if (createEditProceedingCtx.isEditing) {
        response = await updateProceeding(
          createEditProceedingCtx.patient!.patientId,
          createEditProceedingCtx.proceeding!.proceedingId!,
          createUpdateProceedingRequest,
          authCtx.token?.access_token!
        );
      } else {
        response = await createNewProceeding(
          createEditProceedingCtx.patient!.patientId,
          createUpdateProceedingRequest,
          authCtx.token?.access_token!
        );
      }
      if (response) {
        Alert.alert(
          'Sucesso',
          `Procedimento ${createEditProceedingCtx.isEditing ? 'salvo' : 'criado'}!`
        );
        createEditProceedingCtx.clearState();
        navigationEditPatient.navigate('ProceedingsList', {
          patient: createEditProceedingCtx.patient!,
          refresh: true
        });
      } else {
        Alert.alert(
          'Erro',
          'Ocorreu um erro ao salvar as informações do procedimento! Tente novamenete.'
        );
      }
    };

    if (createEditProceedingCtx.validate(createEditProceedingCtx, true)) {
      callApi();
    } else {
      navigationCreateEditProceeding?.navigate('ProceedingInfoScreen');
    }
  };

  const DatePickerMemo = useMemo(() => {
    return (
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
    );
  }, [createEditProceedingCtx, navigationCreateEditProceeding]);

  const TypeMemo = useMemo(() => {
    return (
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
    );
  }, [createEditProceedingCtx, navigationCreateEditProceeding]);

  const BeforePhotosMemo = useMemo(() => {
    return (
      <PatientPhotos
        field="beforePhotos"
        title="Fotos do Antes"
        values={createEditProceedingCtx.inputs}
      />
    );
  }, [
    createEditProceedingCtx,
    createEditProceedingCtx.inputs!['beforePhotos']!.value,
    navigationCreateEditProceeding
  ]);

  const AfterPhotosMemo = useMemo(() => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigationCreateEditProceeding.navigate('AfterPhotosScreen');
        }}
      >
        <PatientPhotos
          field="afterPhotos"
          title="Fotos do Depois"
          values={createEditProceedingCtx.inputs}
        />
      </TouchableOpacity>
    );
  }, [createEditProceedingCtx, navigationCreateEditProceeding]);

  //console.log(`BEFORE PHOTOS: ${createEditProceedingCtx.inputs!['beforePhotos'].value![0].url}`);

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
          <Button type={ButtonTypes.Primary} onPress={submit} text={{ fontSize: 18 }}>
            Salvar
          </Button>
        </View>
      </View>
      {DatePickerMemo}
      {TypeMemo}
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
        {BeforePhotosMemo}
        {AfterPhotosMemo}
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
