/** @format */
import { ApiResponse } from '../models/Api/ApiResponse';
import { ErrorDetails } from '../models/Api/ErrorDetails';
import { CreateServiceRequest } from '../models/customers/services/CreateServiceRequest';
import { CreateServiceResponse } from '../models/customers/services/CreateServiceResponde';
import { GetServiceByIdResponse } from '../models/customers/services/GetServiceByIdResponse';
import { GetServicesResponse } from '../models/customers/services/GetServicesResponse';
import { UpdateServiceRequest } from '../models/customers/services/UpdateServiceRequest';
import { UpdateServiceResponse } from '../models/customers/services/UpdateServiceResponse';

export const createService = async (
  accessToken: string,
  customerId: string,
  request: CreateServiceRequest
): Promise<ApiResponse> => {
  try {
    const URL_ADDRESS = `${process.env.API_URL}/customers/${customerId}/services`;

    const formData = new FormData();
    formData.append('date', request.date.toString());
    formData.append('serviceTypes', JSON.stringify(request.serviceTypes));
    formData.append('beforeNotes', request.beforeNotes!);
    formData.append('afterNotes', request.afterNotes!);
    if (request.beforePhotos) {
      for (const photo of request.beforePhotos) {
        formData.append('beforePhotos', {
          name: photo.name,
          type: photo.file.type,
          uri: photo.url
        } as unknown as Blob);
      }
    }
    if (request.afterPhotos) {
      for (const photo of request.afterPhotos) {
        formData.append('afterPhotos', {
          name: photo.name,
          type: photo.file.type,
          uri: photo.url
        } as unknown as Blob);
      }
    }
    const response = await fetch(URL_ADDRESS, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      },
      body: formData
    });

    if (response.ok) {
      const responseBody: CreateServiceResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
    } else {
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};

export const getServiceById = async (
  accessToken: string,
  customerId: string,
  serviceId: string
): Promise<ApiResponse> => {
  const URL = `${process.env.API_URL}/customers/${customerId}/services/${serviceId}`;
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
      const responseBody: GetServiceByIdResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
    } else {
      console.log(`API - GET SERVICE BY ID: ${response.status} - ${response.statusText}`);
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};

export const updateService = async (
  accessToken: string,
  customerId: string,
  serviceId: string,
  request: UpdateServiceRequest
): Promise<ApiResponse> => {
  try {
    const URL_ADDRESS = `${process.env.API_URL}/customers/${customerId}/services/${serviceId}`;

    const formData = new FormData();
    formData.append('date', request.date.toString());
    formData.append('serviceTypes', JSON.stringify(request.serviceTypes));
    formData.append('beforeNotes', request.beforeNotes!);
    formData.append('afterNotes', request.afterNotes!);
    if (request.beforePhotos) {
      for (const photo of request.beforePhotos) {
        formData.append('beforePhotos', {
          name: photo.name,
          type: photo.file.type,
          uri: photo.url
        } as unknown as Blob);
      }
    }
    if (request.afterPhotos) {
      for (const photo of request.afterPhotos) {
        formData.append('afterPhotos', {
          name: photo.name,
          type: photo.file.type,
          uri: photo.url
        } as unknown as Blob);
      }
    }
    const response = await fetch(URL_ADDRESS, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json'
      },
      body: formData
    });

    if (response.ok) {
      const responseBody: UpdateServiceResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
    } else {
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};

export const getServices = async (
  accessToken: string,
  pageNumber: string,
  limit: string,
  customerId: string,
  startDate?: Date,
  endDate?: Date,
  serviceTypeIds?: string[]
): Promise<ApiResponse> => {
  let URL = `${process.env.API_URL}/customers/${customerId}/services?pageNumber=${pageNumber}&limit=${limit}`;

  if (startDate && endDate) {
    URL += `&startDate=${startDate.toLocaleString()}&endDate=${endDate.toLocaleString()}`;
  }

  if (serviceTypeIds && serviceTypeIds.length > 0) {
    for (const serviceTypeId of serviceTypeIds) {
      URL += `&serviceTypeIds=${serviceTypeId}`;
    }
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
      const responseBody: GetServicesResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
    } else {
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};
