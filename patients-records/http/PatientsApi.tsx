import { CreatePatientRequest } from '../models/CreatePatientRequest';
import { CreatePatientResponse } from '../models/CreatePatientResponse';
import { GetPatient, GetPatientsResponse } from '../models/GetPatientsResponse';
import axios from 'axios';
import { UpdatePatientRequest } from 'models/UpdatePatientRequest';
import { UpdatePatientResponse } from 'models/UpdatePatientResponse';

export const createNewPatient = async (request: CreatePatientRequest) => {
  const url = `http://10.0.2.2:3006/patients`;

  const response: CreatePatientResponse | undefined = await axios
    .post(url, request)
    .then((response) => {
      return response.data as CreatePatientResponse;
    })
    .catch((err) => {
      console.log(`createNewPatient method Error:${err}`);
      return undefined;
    });

  return response;
};

export const updatePatient = async (request: UpdatePatientRequest) => {
  const url = `http://10.0.2.2:3006/patients/${request.patientId}`;

  const response: UpdatePatientResponse | undefined = await axios
    .put(url, request)
    .then((response) => {
      return response.data as UpdatePatientResponse;
    })
    .catch((err) => {
      console.log(`updatePatient method Error:${err}`);
      return undefined;
    });

  return response;
};

export const getPatientById = async (patientId: string) => {
  const url = `http://10.0.2.2:3006/patients/${patientId}`;

  const response: GetPatient | undefined = await axios
    .get(url)
    .then((response) => {
      return response.data as GetPatient;
    })
    .catch((err) => {
      console.log(`getPatientById method Error:${err}`);
      return undefined;
    });

  return response;
};

export const getPatients = async (
  pageNumber: number,
  limit: number,
  patientName?: string,
  advancedFilters?: any
) => {
  let url = `http://10.0.2.2:3006/patients?pageNumber=${pageNumber}&limit=${limit}${
    patientName ? '&patientName=' + patientName : ''
  }`;

  url += `${
    advancedFilters?.startDate ? '&startDate=' + advancedFilters.startDate.toISOString() : ''
  }`;

  url += `${advancedFilters?.endDate ? '&endDate=' + advancedFilters.endDate.toISOString() : ''}`;

  url += `${
    advancedFilters?.proceedingTypeId
      ? '&proceedingTypeId=' + advancedFilters?.proceedingTypeId
      : ''
  }`;

  const response: GetPatientsResponse | undefined = await axios
    .get(url)
    .then((response) => {
      return response.data as GetPatientsResponse;
    })
    .catch((err) => {
      console.log(`getPatients method Error:${err}`);
      return undefined;
    });

  return response;
};
