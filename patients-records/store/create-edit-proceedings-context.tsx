/* eslint-disable import/order */
import { createNewProceeding, updateProceeding } from '../http/ProceedingsApi';
import { GetPatient } from '../models/GetPatientsResponse';
import {
  GetProceedingPhotosResponse,
  GetProceedingResponse
} from '../models/proceedings/GetProceedingResponse';
import { AuthContext } from './auth-context';
import { CreateProceedingRequest } from 'models/proceedings/CreateProceedingRequest';
import { UpdateProceedingRequest } from 'models/proceedings/UpdateProceedingRequest';
import { createContext, useContext, useState } from 'react';
import { Alert } from 'react-native';

export type ErrorType = {
  date: null | string;
  type: null | string;
  notes: null | string;
  beforePhotos: null | string;
  afterPhotos: null | string;
};

export type Inputs = {
  patientId: string;
  proceedingId: string | undefined;
  date: {
    value: Date;
    isValid: boolean;
  };
  type: {
    value: string | undefined;
    isValid: boolean;
  };
  notes: {
    value: string | undefined;
    isValid: boolean;
  };
  beforePhotos: {
    value: GetProceedingPhotosResponse[] | null | undefined;
    isValid: boolean;
    createNew: boolean;
  };
  afterPhotos: {
    value: GetProceedingPhotosResponse[] | null | undefined;
    isValid: boolean;
    createNew: boolean;
  };
};

export type Touched = {
  date: boolean;
  type: boolean;
  notes: boolean;
  beforePhotos: boolean;
  afterPhotos: boolean;
};

type ProceedingState = {
  patient: GetPatient | undefined;
  proceeding: GetProceedingResponse | undefined;
  isEditing: boolean;
  inputs: Inputs | undefined;
  touched: Touched | undefined;
  errors: ErrorType | undefined;
  submitHandler: () => void;
  handleChange: (field: string, enteredValue: any) => void;
  handleBlur: (field: string) => void;
  initializeState: (
    patientParam: GetPatient | undefined,
    proceedingParam: GetProceedingResponse | undefined
  ) => void;
  validate: (
    createUpdateProceedingRequest: UpdateProceedingRequest | CreateProceedingRequest | undefined
  ) => boolean;
};

const initialState: ProceedingState = {
  patient: undefined,
  proceeding: undefined,
  isEditing: false,
  inputs: undefined,
  touched: undefined,
  errors: undefined,
  submitHandler: () => {},
  handleChange: (field: string, enteredValue: any) => {},
  handleBlur: (field: string) => {},
  initializeState: (
    patientParam: GetPatient | undefined,
    proceedingParam: GetProceedingResponse | undefined
  ) => {},
  validate: (
    createUpdateProceedingRequest: UpdateProceedingRequest | CreateProceedingRequest
  ): boolean => {
    return false;
  }
};

export const CreateEditProceedingContext = createContext(initialState);

const CreateEditProceedingProvider = ({ children, patientInit }) => {
  const authCtx = useContext(AuthContext);
  const [patient, setPatient] = useState<GetPatient>(patientInit);
  const [proceeding, setProceeding] = useState<GetProceedingResponse | undefined>(undefined);
  const [isEditing, setIsEditing] = useState<boolean>(!!proceeding);

  const initializeState = (
    patientParam: GetPatient,
    proceedingParam: GetProceedingResponse | undefined
  ) => {
    setPatient(patientParam);
    setProceeding(proceedingParam);
    setIsEditing(!!proceedingParam);
  };

  const [inputs, setInputs] = useState<Inputs>({
    patientId: patient!.patientId,
    proceedingId: proceeding?.proceedingId,
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
      createNew: false
    },
    afterPhotos: {
      value: isEditing ? proceeding?.afterPhotos : [],
      isValid: true,
      createNew: false
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
          [field]: {
            value: enteredValue,
            isValid: true,
            createNew: isEditing
          }
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

  const createRequest = (): UpdateProceedingRequest | CreateProceedingRequest => {
    const createUpdateProceedingRequest = {
      proceedingId: inputs.proceedingId,
      date: inputs.date.value,
      proceedingTypeDescription: inputs.type.value!,
      notes: inputs.notes.value,
      beforePhotos: inputs.beforePhotos.value,
      beforePhotosCreateNew: inputs.beforePhotos.createNew,
      afterPhotos: inputs.afterPhotos.value,
      afterPhotosCreateNew: inputs.afterPhotos.createNew
    };
    return createUpdateProceedingRequest;
  };

  const validate = (
    createUpdateProceedingRequestParam:
      | UpdateProceedingRequest
      | CreateProceedingRequest
      | undefined
  ): boolean => {
    const createUpdateProceedingRequest = createUpdateProceedingRequestParam
      ? createUpdateProceedingRequestParam
      : createRequest();
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

    return dateIsValid && typeIsValid && notesIsValid;
  };

  const submitHandler = (navigate?: any) => {
    const createUpdateProceedingRequest = createRequest();

    const callApi = async () => {
      let response: any;
      if (isEditing) {
        response = await updateProceeding(
          patient!.patientId,
          inputs.proceedingId!,
          createUpdateProceedingRequest,
          authCtx.token?.access_token!
        );
      } else {
        response = await createNewProceeding(
          patient!.patientId,
          createUpdateProceedingRequest,
          authCtx.token?.access_token!
        );
      }
      if (response) {
        Alert.alert('Sucesso', `Procedimento ${isEditing ? 'salvo' : 'criado'}!`);
        setIsEditing(true);
        setInputs({
          patientId: patient!.patientId,
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
            createNew: false
          },
          afterPhotos: {
            value: response?.afterPhotos,
            isValid: true,
            createNew: false
          }
        });
      } else {
        Alert.alert(
          'Erro',
          'Ocorreu um erro ao salvar as informações do procedimento! Tente novamenete.'
        );
      }
    };

    if (validate(createUpdateProceedingRequest)) {
      callApi();
    } else {
      navigate?.navigate('ProceedingInfoScreen');
    }
  };

  const value = {
    patient,
    proceeding,
    isEditing,
    inputs,
    touched,
    errors,
    submitHandler,
    handleChange,
    handleBlur,
    initializeState,
    validate
  };

  return (
    <CreateEditProceedingContext.Provider value={value}>
      {children}
    </CreateEditProceedingContext.Provider>
  );
};

export default CreateEditProceedingProvider;
