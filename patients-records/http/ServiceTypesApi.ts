/** @format */
import { ApiResponse } from '../models/Api/ApiResponse';
import { ErrorDetails } from '../models/Api/ErrorDetails';
import { CreateServiceTypeRequest } from '../models/customers/service-types/CreateServiceTypeRequest';
import { CreateServiceTypeResponse } from '../models/customers/service-types/CreateServiceTypeResponse';
import { GetServiceTypeResponse } from '../models/customers/service-types/GetServiceTypesResponse';
import { UpdateServiceTypeRequest } from '../models/customers/service-types/UpdateServiceTypeRequest';
import { UpdateServiceTypeResponse } from '../models/customers/service-types/UpdateServiceTypeResponse';

export const createServiceType = async (
  accessToken: string,
  request: CreateServiceTypeRequest
): Promise<ApiResponse> => {
  const URL = `${process.env.API_URL}/customers/services/types`;

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
      const responseBody: CreateServiceTypeResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
    } else {
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};

export const getServiceTypesList = async (
  accessToken: string,
  serviceTypeDescription?: string
): Promise<ApiResponse> => {
  let URL = `${process.env.API_URL}/customers/services/types`;

  if (serviceTypeDescription) {
    URL += `?serviceTypeDescription=${serviceTypeDescription}`;
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
      const responseBody: GetServiceTypeResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
    } else {
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};

export const updateServiceType = async (
  accessToken: string,
  request: UpdateServiceTypeRequest
): Promise<ApiResponse> => {
  const URL = `${process.env.API_URL}/customers/services/types/${request.serviceTypeId}`;

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
      const responseBody: UpdateServiceTypeResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
    } else {
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};
