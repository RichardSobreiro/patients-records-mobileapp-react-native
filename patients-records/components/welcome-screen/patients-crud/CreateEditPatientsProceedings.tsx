/* eslint-disable import/order */
import { Colors } from '../../../constants/styles';
import { createNewProceeding, updateProceeding } from '../../../http/ProceedingsApi';
import { GetPatient } from '../../../models/GetPatient';
import FlatButton from '../../ui/FlatButton';
import DatePicker from '../../ui/custom-form/DatePicker';
import Input from '../../ui/custom-form/Input';
import PatientPhotos from './PatientPhotos';
import { useLayoutEffect, useState } from 'react';
import { Alert, StyleSheet, View } from 'react-native';

type Props = {
  patient: GetPatient;
  navigateToProceedingsList: () => void;
  setHeaderSubtitle?;
  proceeding?;
};

type ErrorType = {
  date: null | string;
  type: null | string;
  notes: null | string;
  beforePictures: null | string;
  afterPictures: null | string;
};

const CreateEditPatientsProceedings: React.FC<Props> = ({
  patient,
  navigateToProceedingsList,
  setHeaderSubtitle,
  proceeding
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(!!proceeding);
  useLayoutEffect(() => {
    setHeaderSubtitle('Novo Procedimento');
  });
  const [inputs, setInputs] = useState({
    patientId: patient.patientId,
    date: {
      value: new Date(),
      isValid: true
    },
    type: {
      value: '',
      isValid: true
    },
    notes: {
      value: '',
      isValid: true
    },
    beforePictures: {
      value: [],
      isValid: true
    },
    afterPictures: {
      value: [],
      isValid: true
    }
  });
  const [touched, setTouched] = useState({
    date: false,
    type: false,
    notes: false,
    beforePictures: false,
    afterPictures: false
  });
  const [errors, setErrors] = useState<ErrorType>({
    date: null,
    type: null,
    notes: null,
    beforePictures: null,
    afterPictures: null
  });

  const handleChange = (field: string, enteredValue: any) => {
    setTouched((curTouched) => {
      curTouched[field] = true;
      return curTouched;
    });
    setInputs((curInputs) => {
      if (field === 'beforePictures' || field === 'afterPictures') {
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
      beforePictures: inputs.beforePictures.value,
      afterPictures: inputs.afterPictures.value
    };

    const dateIsValid = createProceedingRequest.date.toString() !== 'Invalid Date';
    const typeIsValid = createProceedingRequest.proceedingTypeDescription.trim().length > 0;
    const notesIsValid = createProceedingRequest.notes.trim().length > 0;

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
        response = await createNewProceeding(patient.patientId, createProceedingRequest);
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
    <>
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
        field="beforePictures"
        title="Fotos do Antes"
        handleChange={handleChange}
        handleBlur={handleBlur}
        handleSubmit={submitHandler}
        values={inputs}
        errors={errors}
        touched={touched}
      />
      <PatientPhotos
        field="afterPictures"
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
          <FlatButton onPress={navigateToProceedingsList} text={{ fontSize: 18, color: '#888888' }}>
            Cancelar
          </FlatButton>
        </View>
        <View>
          <FlatButton onPress={submitHandler} text={{ color: Colors.primary800, fontSize: 18 }}>
            Salvar
          </FlatButton>
        </View>
      </View>
    </>
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
  }
  // patientInfoContainer: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   flex: 1
  // },
  // patientInfoText: {
  //   fontSize: 24,
  //   textAlign: 'center'
  // }
});
