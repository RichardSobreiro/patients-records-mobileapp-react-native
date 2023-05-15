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
      isValid: true
    },
    afterPhotos: {
      value: isEditing ? proceeding?.afterPhotos : [],
      isValid: true
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
        return { ...curInputs };
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
    const createProceedingRequest = {
      date: inputs.date.value,
      proceedingTypeDescription: inputs.type.value,
      notes: inputs.notes.value,
      beforePhotos: inputs.beforePhotos,
      afterPhotos: inputs.afterPhotos
    };

    const dateIsValid = createProceedingRequest.date.toString() !== 'Invalid Date';
    const typeIsValid = createProceedingRequest.proceedingTypeDescription!.trim().length > 0;
    const notesIsValid = createProceedingRequest.notes!.trim().length > 0;

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
        response = await updateProceeding();
      } else {
        response = await createNewProceeding(
          patient.patientId,
          createProceedingRequest,
          authCtx.token?.access_token!
        );
      }
      if (response) {
        Alert.alert('Sucesso', 'Procedimento criado!');
        setIsEditing(true);
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
        <View>
          <Button
            type={ButtonTypes.Cancel}
            onPress={navigateToProceedingsList}
            text={{ fontSize: 18 }}
          >
            {isEditing ? 'Voltar' : 'Cancelar'}
          </Button>
        </View>
        <View>
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
    padding: 20,
    backgroundColor: Colors.formBackgroundColor,
    flex: 1
  }
});
