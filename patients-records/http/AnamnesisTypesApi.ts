/** @format */
import { ApiResponse } from '../models/Api/ApiResponse';
import { ErrorDetails } from '../models/Api/ErrorDetails';
import { CreateAnamnesisTypeRequest } from '../models/customers/anamnesis-types/CreateAnamnesisTypeRequest';
import { CreateAnamnesisTypeResponse } from '../models/customers/anamnesis-types/CreateAnamnesisTypeResponse';
import { GetAnamnesisTypeByIdResponse } from '../models/customers/anamnesis-types/GetAnamnesisTypeByIdResponse';
import { GetAnamnesisTypeResponse } from '../models/customers/anamnesis-types/GetAnamnesisTypesResponse';
import { UpdateAnamnesisTypeRequest } from '../models/customers/anamnesis-types/UpdateAnamnesisTypeRequest';
import { UpdateAnamnesisTypeResponse } from '../models/customers/anamnesis-types/UpdateAnamnesisTypeResponse';

export const createAnamnesisType = async (
  accessToken: string,
  request: CreateAnamnesisTypeRequest
): Promise<ApiResponse> => {
  const URL = `http://10.0.2.2:3006/customers/anamnesis/types`;

  try {
    const response = await fetch(URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (response.ok) {
      const responseBody: CreateAnamnesisTypeResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
    } else {
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};

export const getAnamnesisTypeById = async (
  accessToken: string,
  anamnesisTypeId: string
): Promise<ApiResponse> => {
  const URL = `http://10.0.2.2:3006/customers/anamnesis/types/${anamnesisTypeId}`;

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
      const responseBody: GetAnamnesisTypeByIdResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
    } else {
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};

export const getAnamnesisTypesList = async (
  accessToken: string,
  anamnesisTypeDescription?: string
): Promise<ApiResponse> => {
  let URL = `http://10.0.2.2:3006/customers/anamnesis/types`;

  if (anamnesisTypeDescription) {
    URL += `?anamnesisTypeDescription=${anamnesisTypeDescription}`;
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
      const responseBody: GetAnamnesisTypeResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
    } else {
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};

export const updateAnamnesisType = async (
  accessToken: string,
  request: UpdateAnamnesisTypeRequest
): Promise<ApiResponse> => {
  const URL = `${process.env.API_URL}/customers/anamnesis/types/${request.anamnesisTypeId}`;

  try {
    const response = await fetch(URL, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (response.ok) {
      const responseBody: UpdateAnamnesisTypeResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
    } else {
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};
