import { CreateProceedingRequest } from '../models/proceedings/CreateProceedingRequest';
import { CreateProceedingResponse } from '../models/proceedings/CreateProceedingResponse';
import { UpdateProceedingRequest } from '../models/proceedings/UpdateProceedingRequest';
import axios from 'axios';
import { GetProceedingsResponse } from 'models/proceedings/GetProceedingResponse';
import { GetProceedingTypesResponse } from 'models/proceedings/GetProceedingTypesResponse';
import { UpdateProceedingResponse } from 'models/proceedings/UpdateProceedingResponse';

export const createNewProceeding = async (
  patientId: string,
  proceeding: CreateProceedingRequest,
  access_token: string
) => {
  const url = `${process.env.API_URL}/patients/${patientId}/proceedings`;

  const axiosMultiPartFormData = axios.create();

  const formData = new FormData();
  formData.append('date', proceeding.date.toDateString());
  formData.append('proceedingTypeDescription', proceeding.proceedingTypeDescription!);
  formData.append('notes', proceeding.notes!);
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

export const updateProceeding = async (
  patientId: string,
  proceedingId: string,
  proceeding: UpdateProceedingRequest,
  access_token: string
) => {
  const url = `${process.env.API_URL}/patients/${patientId}/proceedings/${proceedingId}`;

  const axiosMultiPartFormData = axios.create();

  const formData = new FormData();
  formData.append('date', proceeding.date.toDateString());
  formData.append('proceedingTypeDescription', proceeding.proceedingTypeDescription!);
  formData.append('notes', proceeding.notes!);
  if (proceeding.beforePhotosCreateNew!) {
    formData.append('beforePhotosCreateNew', proceeding.beforePhotosCreateNew!.toString());
    for (const photo of proceeding.beforePhotos) {
      let localUri = photo.uri ?? photo.url;
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
  }
  if (proceeding.afterPhotosCreateNew!) {
    formData.append('afterPhotosCreateNew', proceeding.afterPhotosCreateNew!.toString());
    for (const photo of proceeding.afterPhotos) {
      let localUri = photo.uri ?? photo.url;
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
  }

  const response: UpdateProceedingResponse | undefined = await axiosMultiPartFormData
    .put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${access_token}`
      },
      transformRequest: (data, headers) => {
        return formData;
      }
    })
    .then((response) => {
      return response.data as UpdateProceedingResponse;
    })
    .catch((err) => {
      console.log(err);
      return undefined;
    });

  return response;
};

export const getProceedingById = async (patientId: string) => {};

export const getProceedings = async (patientId: string, pageNumber: number, limit: number) => {
  const url = `${process.env.API_URL}/patients/${patientId}/proceedings?pageNumber=${pageNumber}&limit=${limit}`;

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
  const url = `${process.env.API_URL}/professionals/${username}/proceedings/types`;

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
