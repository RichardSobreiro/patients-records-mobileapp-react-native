import { CreateProceedingRequest } from '../models/proceedings/CreateProceedingRequest';
import { CreateProceedingResponse } from '../models/proceedings/CreateProceedingResponse';
import axios from 'axios';
import { GetProceedingsResponse } from 'models/proceedings/GetProceedingResponse';
import { GetProceedingTypesResponse } from 'models/proceedings/GetProceedingTypesResponse';

export const createNewProceeding = async (
  patientId: string,
  proceeding: CreateProceedingRequest,
  access_token: string
) => {
  const url = `http://10.0.2.2:3006/patients/${patientId}/proceedings`;

  const axiosMultiPartFormData = axios.create();

  const formData = new FormData();
  formData.append('date', proceeding.date.toDateString());
  formData.append('proceedingTypeDescription', proceeding.proceedingTypeDescription);
  formData.append('notes', proceeding.notes);
  for (const photo of proceeding.beforePhotos) {
    let localUri = photo.uri;
    let filename = localUri?.split('/').pop();
    let match = /\.(\w+)$/.exec(filename!);
    let type = match ? `image/${match[1]}` : `image`;
    formData.append('beforePhotos', {
      name: filename,
      type: type,
      uri: localUri,
      width: photo.width,
      height: photo.height
    } as unknown as Blob);
  }
  for (const photo of proceeding.afterPhotos) {
    let localUri = photo.uri;
    let filename = localUri?.split('/').pop();
    let match = /\.(\w+)$/.exec(filename!);
    let type = match ? `image/${match[1]}` : `image`;
    formData.append('afterPhotos', {
      name: filename,
      type: type,
      uri: localUri,
      width: photo.width,
      height: photo.height
    } as unknown as Blob);
  }

  const response: CreateProceedingResponse | undefined = await axiosMultiPartFormData
    .post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${access_token}`
      },
      transformRequest: (data, headers) => {
        return formData;
      }
    })
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

export const getProceedingTypesByUserEmail = async (username: string) => {
  const url = `http://10.0.2.2:3006/professionals/${username}/proceedings/types`;

  const response: GetProceedingTypesResponse | undefined = await axios
    .get(url)
    .then((response) => {
      return response.data as GetProceedingTypesResponse;
    })
    .catch((err) => {
      console.log(`getProceedingTypesByUsername method Error:${err}`);
      return undefined;
    });

  return response;
};
