/* eslint-disable import/order */
import { Colors } from '../../../constants/styles';
import { createNewProceeding, updateProceeding } from '../../../http/ProceedingsApi';
import { GetPatient } from '../../../models/GetPatientsResponse';
import { AuthContext } from '../../../store/auth-context';
import Button, { ButtonTypes } from '../../ui/Button';
import FlatButton from '../../ui/FlatButton';
import DatePicker from '../../ui/custom-form/DatePicker';
import Input from '../../ui/custom-form/Input';
import PatientPhotos from './PatientPhotos';
import { GetProceedingResponse } from 'models/proceedings/GetProceedingResponse';
import { useContext, useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Props = {
  patient: GetPatient;
  navigateToProceedingsList: () => void;
  setHeaderSubtitle?;
  proceeding?: GetProceedingResponse;
};

type ErrorType = {
  date: null | string;
  type: null | string;
  notes: null | string;
  beforePhotos: null | string;
  afterPhotos: null | string;
};

const CreateEditPatientsProceedings: React.FC<Props> = ({
  patient,
  navigateToProceedingsList,
  setHeaderSubtitle,
  proceeding
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(!!proceeding);
  const authCtx = useContext(AuthContext);

  useLayoutEffect(() => {
    setHeaderSubtitle('Novo Procedimento');
  });

  const [inputs, setInputs] = useState({
    patientId: patient.patientId,
    proceedingId: isEditing ? proceeding?.proceedingId : '',
    date: {
      value: isEditing ? new Date(proceeding?.date!) : new Date(),
      isValid: true
    },
    type: {
      value: isEditing ? proceeding?.proceedingTypeDescription : '',
      isValid: true
    },
    notes: {
      value: isEditing ? proceeding?.notes : '',
      isValid: true
    },
    beforePhotos: {
      value: isEditing ? proceeding?.beforePhotos : [],
      isValid: true,
      wasUpdated: false
    },
    afterPhotos: {
      value: isEditing ? proceeding?.afterPhotos : [],
      isValid: true,
      wasUpdated: false
    }
  });
  const [touched, setTouched] = useState({
    date: false,
    type: false,
    notes: false,
    beforePhotos: false,
    afterPhotos: false
  });
  const [errors, setErrors] = useState<ErrorType>({
    date: null,
    type: null,
    notes: null,
    beforePhotos: null,
    afterPhotos: null
  });

  const handleChange = (field: string, enteredValue: any) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
    setInputs((curInputs) => {
      if (field === 'beforePhotos' || field === 'afterPhotos') {
        return {
          ...curInputs,
          [field]: { value: enteredValue, isValid: true, wasUpdated: isEditing }
        };
      } else {
        return {
          ...curInputs,
          [field]: { value: enteredValue, isValid: true }
        };
      }
    });
  };

  const handleBlur = (field: string) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
  };

  const submitHandler = () => {
    const createUpdateProceedingRequest = {
      proceedingId: inputs.proceedingId,
      date: inputs.date.value,
      proceedingTypeDescription: inputs.type.value!,
      notes: inputs.notes.value,
      beforePhotos: inputs.beforePhotos.value,
      afterPhotos: inputs.afterPhotos.value
    };

    const dateIsValid = createUpdateProceedingRequest.date.toString() !== 'Invalid Date';
    const typeIsValid = createUpdateProceedingRequest.proceedingTypeDescription!.trim().length > 0;
    const notesIsValid = createUpdateProceedingRequest.notes!.trim().length > 0;

    setErrors((curErrors) => {
      if (!dateIsValid) {
        curErrors['date'] = 'A data do procedimento é inválida';
      } else {
        curErrors['date'] = null;
      }
      if (!typeIsValid) {
        curErrors['type'] = 'O tipo do procedimento é inválido';
      } else {
        curErrors['type'] = null;
      }
      if (!notesIsValid) {
        curErrors['notes'] = 'Você precisa preencher as observações do procedimento';
      } else {
        curErrors['notes'] = null;
      }
      return curErrors;
    });

    const callApi = async () => {
      let response: any;
      if (isEditing) {
        response = await updateProceeding(
          patient.patientId,
          createUpdateProceedingRequest.proceedingId!,
          createUpdateProceedingRequest,
          authCtx.token?.access_token!
        );
      } else {
        response = await createNewProceeding(
          patient.patientId,
          createUpdateProceedingRequest,
          authCtx.token?.access_token!
        );
      }
      if (response) {
        Alert.alert('Sucesso', 'Procedimento criado!');
        setIsEditing(true);
        setInputs({
          patientId: patient.patientId,
          proceedingId: response.proceedingId,
          date: {
            value: new Date(response?.date!),
            isValid: true
          },
          type: {
            value: response?.proceedingTypeDescription,
            isValid: true
          },
          notes: {
            value: response?.notes,
            isValid: true
          },
          beforePhotos: {
            value: response?.beforePhotos,
            isValid: true,
            wasUpdated: false
          },
          afterPhotos: {
            value: response?.afterPhotos,
            isValid: true,
            wasUpdated: false
          }
        });
      } else {
        Alert.alert(
          'Erro',
          'Ocorreu um erro ao salvar as informações do procedimento! Tente novamenete.'
        );
      }
    };

    callApi();
  };

  return (
    <KeyboardAwareScrollView
      style={styles.content}
      showsVerticalScrollIndicator={true}
      keyboardShouldPersistTaps="handled"
    >
      <DatePicker
        field="date"
        label="Data do Procedimento"
        values={inputs}
        touched={touched}
        errors={errors}
        onChangeHandler={handleChange}
      />
      <Input
        field="type"
        label="Tipo"
        values={inputs}
        touched={touched}
        errors={errors}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
      />
      <Input
        field="notes"
        label="Observações Gerais"
        values={inputs}
        touched={touched}
        errors={errors}
        onChangeHandler={handleChange}
        onBlurHandler={handleBlur}
        textInputConfig={{ multiline: true }}
      />
      <PatientPhotos
        field="beforePhotos"
        title="Fotos do Antes"
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleSubmit={submitHandler}
        values={inputs}
        errors={errors}
        touched={touched}
      />
      <PatientPhotos
        field="afterPhotos"
        title="Fotos do Depois"
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleSubmit={submitHandler}
        values={inputs}
        errors={errors}
        touched={touched}
      />
      <View style={styles.patientInfoContainer}>
        <View style={{ flex: 1, marginRight: 5 }}>
          <Button
            type={ButtonTypes.Cancel}
            onPress={navigateToProceedingsList}
            text={{ fontSize: 18 }}
          >
            {isEditing ? 'Voltar' : 'Cancelar'}
          </Button>
        </View>
        <View style={{ flex: 1, marginLeft: 5 }}>
          <Button type={ButtonTypes.Primary} onPress={submitHandler} text={{ fontSize: 18 }}>
            Salvar
          </Button>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default CreateEditPatientsProceedings;

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
    shadowColor: 'black',
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.35,
    shadowRadius: 4
  }
});
