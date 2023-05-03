import { GetPatientsResponse, GetPatient } from '../models/Patient';
import axios from 'axios';

export type PatientCreatedResponse = {
  username: string;
  patientId: string;
  patientName: string;
  phoneNumber: string;
  birthDate: Date;
  creationDate: Date;
  email?: string;
};

export type PatientCreatedRequest = {
  username: string;
  patientName: string;
  phoneNumber: string;
  email?: string;
  birthDate: Date;
};

export const createNewPatient = async (request: PatientCreatedRequest) => {
  const url = `http://10.0.2.2:3006/patients`;

  const response: PatientCreatedResponse | undefined = await axios
    .post(url, request)
    .then((response) => {
      return response.data as PatientCreatedResponse;
    })
    .catch((err) => {
      console.log(err);
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
      console.log(err);
      return undefined;
    });

  return response;
};

export const getPatients = async () => {
  const url = `http://10.0.2.2:3006/patients`;

  const response: GetPatientsResponse | undefined = await axios
    .get(url)
    .then((response) => {
      return response.data as GetPatientsResponse;
    })
    .catch((err) => {
      console.log(err);
      return undefined;
    });

  return response;
};
