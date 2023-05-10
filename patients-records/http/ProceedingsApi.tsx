import { CreateProceedingRequest } from '../models/proceedings/CreateProceedingRequest';
import { CreateProceedingResponse } from '../models/proceedings/CreateProceedingResponse';
import axios from 'axios';
import { GetProceedingsResponse } from 'models/proceedings/GetProceedingResponse';

export const createNewProceeding = async (
  patientId: string,
  proceeding: CreateProceedingRequest
) => {
  const url = `http://10.0.2.2:3006/patients/${patientId}/proceedings`;

  const response: CreateProceedingResponse | undefined = await axios
    .post(url, proceeding)
    .then((response) => {
      return response.data as CreateProceedingResponse;
    })
    .catch((err) => {
      console.log(err);
      return undefined;
    });

  return response;
};

export const updateProceeding = async () => {};

export const getProceedingById = async (patientId: string) => {};

export const getProceedings = async (patientId: string, pageNumber: number, limit: number) => {
  const url = `http://10.0.2.2:3006/patients/${patientId}/proceedings?pageNumber=${pageNumber}&limit=${limit}`;

  const response: GetProceedingsResponse | undefined = await axios
    .get(url)
    .then((response) => {
      return response.data as GetProceedingsResponse;
    })
    .catch((err) => {
      console.log(`getProceedings method Error:${err}`);
      return undefined;
    });

  return response;
};
