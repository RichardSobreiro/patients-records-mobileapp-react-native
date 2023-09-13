/** @format */
import { ApiResponse } from '../models/Api/ApiResponse';
import { ErrorDetails } from '../models/Api/ErrorDetails';
import { UpdateAnamnesisRequest } from '../models/customers//anamnesis/UpdateAnamnesisRequest';
import { CreateAnamnesisRequest } from '../models/customers/anamnesis/CreateAnamneseRequest';
import { CreateAnamnesisResponse } from '../models/customers/anamnesis/CreateAnamneseResponse';
import { GetAnamnesisByIdResponse } from '../models/customers/anamnesis/GetAnamnesisByIdResponse';
import { GetAnamnesisResponse } from '../models/customers/anamnesis/GetAnamnesisResponse';
import { UpdateAnamnesisResponse } from '../models/customers/anamnesis/UpdateAnamnesisResponse';
import FileCustom from '../util/types/FileCustom';

export const createAnamnesis = async (
  accessToken: string,
  request: CreateAnamnesisRequest,
  files?: FileCustom[] | undefined
): Promise<ApiResponse> => {
  const URL = `http://10.0.2.2:3006/customers/${request.customerId}/anamnesis`;

  const formData = new FormData();

  request.date.setHours(0, 0, 0);

  formData.append('customerId', request.customerId);
  formData.append('date', request.date.toString());
  formData.append('anamnesisTypesContent', JSON.stringify(request.anamnesisTypesContent));
  if (files) {
    for (const file of files) {
      formData.append('files', {
        name: file.name,
        type: file.file.type,
        uri: file.url
      } as unknown as Blob);
    }
  }

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      },
      body: formData
    });

    if (response.ok) {
      const responseBody: CreateAnamnesisResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
    } else {
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};

export const getAnamnesisById = async (
  accessToken: string,
  customerId: string,
  anamnesisId: string
): Promise<ApiResponse> => {
  const URL = `http://10.0.2.2:3006/customers/${customerId}/anamnesis/${anamnesisId}`;

  try {
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    if (response.ok) {
      const responseBody: GetAnamnesisByIdResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
    } else {
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};

export const updateAnamnesis = async (
  accessToken: string,
  request: UpdateAnamnesisRequest,
  files?: FileCustom[] | undefined
): Promise<ApiResponse> => {
  const URL = `http://10.0.2.2:3006/customers/${request.customerId}/anamnesis/${request.anamneseId}`;

  const formData = new FormData();

  request.date.setHours(0, 0, 0);

  formData.append('anamneseId', request.anamneseId);
  formData.append('customerId', request.customerId);
  formData.append('date', request.date.toString());
  formData.append('anamnesisTypesContent', JSON.stringify(request.anamnesisTypesContent));
  if (files) {
    for (const file of files) {
      if (!file.id) {
        formData.append('files', {
          name: file.name,
          type: file.file.type,
          uri: file.url
        } as unknown as Blob);
      } else {
        formData.append('existingFilesIds', file.id);
      }
    }
  }

  try {
    const response = await fetch(URL, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      },
      body: formData
    });

    if (response.ok) {
      const responseBody: UpdateAnamnesisResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
    } else {
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    console.log(error);
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};

export const getAnamnesis = async (
  accessToken: string,
  pageNumber: string,
  limit: string,
  customerId: string,
  anamnesisTypeDescription?: string,
  startDate?: Date,
  endDate?: Date,
  anamnesisTypeIds?: string[]
): Promise<ApiResponse> => {
  let URL = `${process.env.API_URL}/customers/${customerId}/anamnesis?pageNumber=${pageNumber}&limit=${limit}&customerId=${customerId}`;

  if (anamnesisTypeDescription && anamnesisTypeDescription !== '') {
    URL += `&anamnesisTypeDescription=${anamnesisTypeDescription}`;
  }

  if (startDate && endDate) {
    URL += `&startDate=${startDate.toLocaleString()}&endDate=${endDate.toLocaleString()}`;
  }

  if (anamnesisTypeIds && anamnesisTypeIds.length > 0) {
    for (const anamnesisTypeId of anamnesisTypeIds) URL += `&anamnesisTypeIds=${anamnesisTypeId}`;
  }

  try {
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    if (response.ok) {
      const responseBody: GetAnamnesisResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
    } else {
      return new ApiResponse(
        false,
        response.status,
        response.statusText,
        new ErrorDetails(response.statusText, response.status)
      );
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};
