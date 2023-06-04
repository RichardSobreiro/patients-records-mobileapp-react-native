/* eslint-disable no-case-declarations */

/* eslint-disable import/order */
import { GetPatient } from '../models/GetPatientsResponse';
import {
  GetProceedingPhotosResponse,
  GetProceedingResponse
} from '../models/proceedings/GetProceedingResponse';
import { useFocusEffect } from '@react-navigation/native';
import { createContext, useEffect, useReducer } from 'react';

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
  isValid: boolean;
  patient: GetPatient | undefined;
  proceeding: GetProceedingResponse | undefined;
  isEditing: boolean;
  inputs: Inputs | undefined;
  touched: Touched | undefined;
  errors: ErrorType | undefined;
  handleChange: (field: string, enteredValue: any) => void;
  handleBlur: (field: string) => void;
  validate: (currentState: ProceedingState, validateAll: boolean) => boolean;
  updateState: (newState: GetProceedingResponse) => void;
  clearState: () => void;
};

const initialState: ProceedingState = {
  isValid: true,
  patient: undefined,
  proceeding: undefined,
  isEditing: false,
  inputs: undefined,
  touched: undefined,
  errors: undefined,
  handleChange: (field: string, enteredValue: any) => {},
  handleBlur: (field: string) => {},
  validate: (currentState: ProceedingState, validateAll: boolean) => {
    return false;
  },
  updateState: (newState: GetProceedingResponse) => {},
  clearState: () => {}
};

export const CreateEditProceedingContext = createContext(initialState);

const createEditProceedingReducer = (state: ProceedingState, action) => {
  const updatedState = { ...state };
  switch (action.type) {
    case 'HANDLE_CHANGE':
      updatedState.touched![action.payload.field] = true;
      if (action.payload.field === 'beforePhotos' || action.payload.field === 'afterPhotos') {
        updatedState.inputs![action.payload.field] = {
          value: action.payload.enteredValue,
          isValid: true,
          createNew: action.payload.createNew
        };
      } else {
        updatedState.inputs![action.payload.field] = {
          value: action.payload.enteredValue,
          isValid: true
        };
      }
      return updatedState;
    case 'HANDLE_BLUR':
      updatedState.touched![action.payload.field] = true;
      return updatedState;
    case 'UPDATE_ERRORS':
      updatedState.errors = action.payload.newErrors;
      return updatedState;
    case 'UPDATE_STATE':
      updatedState.isValid = true;
      updatedState.proceeding = action.payload.newState;
      updatedState.isEditing = true;
      updatedState.inputs = {
        patientId: updatedState.patient!.patientId,
        proceedingId: action.payload.newState.proceedingId,
        date: {
          value: new Date(action.payload.newState?.date!),
          isValid: true
        },
        type: {
          value: action.payload.newState?.proceedingTypeDescription,
          isValid: true
        },
        notes: {
          value: action.payload.newState?.notes,
          isValid: true
        },
        beforePhotos: {
          value: action.payload.newState?.beforePhotos,
          isValid: true,
          createNew: false
        },
        afterPhotos: {
          value: action.payload.newState?.afterPhotos,
          isValid: true,
          createNew: false
        }
      };
      updatedState.touched = {
        date: false,
        type: false,
        notes: false,
        beforePhotos: false,
        afterPhotos: false
      };
      updatedState.errors = {
        date: null,
        type: null,
        notes: null,
        beforePhotos: null,
        afterPhotos: null
      };
      return updatedState;
    case 'CLEAR_STATE':
      updatedState.isValid = true;
      updatedState.proceeding = undefined;
      updatedState.isEditing = false;
      updatedState.inputs = {
        patientId: updatedState.patient!.patientId,
        proceedingId: undefined,
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
        beforePhotos: {
          value: [],
          isValid: true,
          createNew: false
        },
        afterPhotos: {
          value: [],
          isValid: true,
          createNew: false
        }
      };
      updatedState.touched = {
        date: false,
        type: false,
        notes: false,
        beforePhotos: false,
        afterPhotos: false
      };
      updatedState.errors = {
        date: null,
        type: null,
        notes: null,
        beforePhotos: null,
        afterPhotos: null
      };
      return updatedState;
    default:
      return updatedState;
  }
};

const CreateEditProceedingProvider = ({
  children,
  patientInitialValue,
  proceedingInitialValue
}) => {
  const handleChange = (field: string, enteredValue: any, createNew?: boolean) => {
    dispatch({ type: 'HANDLE_CHANGE', payload: { field, enteredValue, createNew } });
  };

  const handleBlur = (field: string) => {
    dispatch({ type: 'HANDLE_BLUR', payload: { field } });
  };

  const validate = (currentState: ProceedingState, validateAll: boolean): boolean => {
    const newErrorsValue: ErrorType = {
      type: null,
      date: null,
      notes: null,
      beforePhotos: null,
      afterPhotos: null
    };
    const dateIsValid = currentState.inputs!.date.toString() !== 'Invalid Date';
    const typeIsValid = !!(
      currentState.inputs!.type && currentState.inputs!.type.value!.trim().length > 0
    );
    const notesIsValid = currentState.inputs!.notes.value!.trim().length > 0;
    if (!dateIsValid) {
      newErrorsValue['date'] = 'A data do procedimento é inválida';
    } else {
      newErrorsValue['date'] = null;
    }
    if (!typeIsValid && (currentState.touched!['type'] || validateAll)) {
      newErrorsValue['type'] = 'O tipo do procedimento é inválido';
    } else {
      newErrorsValue['type'] = null;
    }
    if (!notesIsValid && (currentState.touched!['notes'] || validateAll)) {
      newErrorsValue['notes'] = 'Você precisa preencher as observações do procedimento';
    } else {
      newErrorsValue['notes'] = null;
    }

    dispatch({ type: 'UPDATE_ERRORS', payload: { newErrors: newErrorsValue } });

    return dateIsValid && typeIsValid && notesIsValid;
  };

  const updateState = (newState: GetProceedingResponse) => {
    dispatch({ type: 'UPDATE_STATE', payload: { newState } });
  };

  const clearState = () => {
    dispatch({ type: 'CLEAR_STATE' });
  };

  const [createEditProceedingState, dispatch] = useReducer(createEditProceedingReducer, {
    isValid: true,
    patient: patientInitialValue,
    proceeding: proceedingInitialValue,
    isEditing: !!proceedingInitialValue,
    inputs: {
      patientId: patientInitialValue!.patientId,
      proceedingId: proceedingInitialValue?.proceedingId,
      date: {
        value: proceedingInitialValue ? new Date(proceedingInitialValue?.date!) : new Date(),
        isValid: true
      },
      type: {
        value: proceedingInitialValue ? proceedingInitialValue?.proceedingTypeDescription : '',
        isValid: true
      },
      notes: {
        value: proceedingInitialValue ? proceedingInitialValue?.notes : '',
        isValid: true
      },
      beforePhotos: {
        value: proceedingInitialValue ? proceedingInitialValue?.beforePhotos : [],
        isValid: true,
        createNew: false
      },
      afterPhotos: {
        value: proceedingInitialValue ? proceedingInitialValue?.afterPhotos : [],
        isValid: true,
        createNew: false
      }
    },
    touched: {
      date: false,
      type: false,
      notes: false,
      beforePhotos: false,
      afterPhotos: false
    },
    errors: {
      date: null,
      type: null,
      notes: null,
      beforePhotos: null,
      afterPhotos: null
    },
    handleChange,
    handleBlur,
    validate,
    updateState,
    clearState
  });

  return (
    <CreateEditProceedingContext.Provider value={createEditProceedingState}>
      {children}
    </CreateEditProceedingContext.Provider>
  );
};

export default CreateEditProceedingProvider;
