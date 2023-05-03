/* eslint-disable import/order */
import {
  PatientCreatedResponse,
  createNewPatient,
  getPatientById
} from '../../../http/PatientsApi';
import { GetPatient } from '../../../models/Patient';
import { AuthContext } from '../../../store/auth-context';
import Button, { ButtonTypes } from '../../ui/Button';
import Header from '../Header';
import { validationSchema } from '../validation';
import PatientIdentification from './PatientIdentification';
import { Formik } from 'formik';
import { useCallback, useContext, useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

type Props = {
  onBackFromCreateEditPatientPress: () => void;
  patientId?: string;
};

const CreateEditPatient: React.FC<Props> = ({ onBackFromCreateEditPatientPress, patientId }) => {
  const authCtx = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [patient, setPatient] = useState<GetPatient | undefined>(undefined);

  const handleCancel = useCallback(() => {
    onBackFromCreateEditPatientPress();
  }, [onBackFromCreateEditPatientPress]);

  useEffect(() => {
    if (patientId) {
      setIsEditing(true);
      const getPatient = async () => {
        const response = await getPatientById(patientId);
        if (response) {
          setPatient(response);
        } else {
          Alert.alert(
            'Erro',
            'Ocorreu um erro ao buscar as informações do paciente! Tente novamenete.'
          );
          handleCancel();
        }
      };
      getPatient();
    }
  }, [handleCancel, patientId]);

  const onSubmitHandler = async (values) => {
    let response: PatientCreatedResponse | undefined;
    if (isEditing) {
    } else {
      response = await createNewPatient({
        username: authCtx.userInfo?.username!,
        patientName: values.name,
        phoneNumber: values.phoneNumber,
        email: values.email,
        birthDate: values.birthDate
      });
    }

    if (response?.patientId) {
      setIsEditing(true);
      setPatient(response);
      Alert.alert('Informações Salvas!', '');
    } else {
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao salvar as informações do paciente! Tente novamenete.'
      );
    }
  };

  const isFormValid = (isValid, touched) => {
    return isValid && Object.keys(touched).length !== 0;
  };

  return (
    <>
      <View style={styles.header}>
        <Header isAddingPatientScreen={true} onSkipBackPressed={onBackFromCreateEditPatientPress} />
      </View>
      <KeyboardAwareScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        extraScrollHeight={150}
      >
        <Formik
          initialValues={{
            name: patient?.patientName,
            phoneNumber: patient?.phoneNumber,
            email: patient?.email,
            birthDate: patient?.birthDate
          }}
          onSubmit={onSubmitHandler}
          validationSchema={validationSchema}
          enableReinitialize={true}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid }) => (
            <>
              <PatientIdentification
                handleChange={handleChange}
                handleBlur={handleBlur}
                handleSubmit={handleSubmit}
                values={values}
                errors={errors}
                touched={touched}
                isValid={isValid}
              />

              {isEditing && (
                <View style={styles.buttons}>
                  <Button
                    onPress={(e: any) => {}}
                    type={ButtonTypes.Primary}
                    text={styles.buttonTextStyles}
                    pressable={[styles.buttonPressable]}
                  >
                    Procedimentos
                  </Button>
                </View>
              )}

              <View style={styles.buttons}>
                <Button
                  onPress={handleCancel}
                  text={styles.buttonTextStyles}
                  pressable={[styles.buttonPressable]}
                >
                  Cancelar
                </Button>
                <Button
                  onPress={(e: any) => handleSubmit(e)}
                  text={styles.buttonTextStyles}
                  pressable={[
                    {
                      opacity: isFormValid(isValid, touched) ? 1 : 0.5
                    },
                    styles.buttonPressable
                  ]}
                >
                  Salvar
                </Button>
              </View>
            </>
          )}
        </Formik>
      </KeyboardAwareScrollView>
    </>
  );
};

export default CreateEditPatient;

const styles = StyleSheet.create({
  buttons: {
    flexDirection: 'row',
    marginTop: 5
  },
  buttonPressable: {
    flex: 1,
    marginHorizontal: 5
  },
  buttonTextStyles: { fontSize: 20 },
  header: {
    borderBottomWidth: 1,
    borderBottomColor: '#dbdbdb',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 55
  },
  content: {
    padding: 20,
    backgroundColor: '#f9f9f9'
  },
  button: {
    marginTop: 20,
    backgroundColor: '#2980b9',
    padding: 15,
    borderRadius: 15
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    textAlign: 'center'
  }
});
