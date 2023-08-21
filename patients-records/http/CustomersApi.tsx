import { ApiResponse } from '../models/Api/ApiResponse';
import { ErrorDetails } from '../models/Api/ErrorDetails';
import { GetCustomersResponse } from '../models/GetCustomersResponse';
import { CreateCustomerRequest } from '../models/customers/CreateCustomerRequest';
import { CreateCustomerResponse } from '../models/customers/CreateCustomerResponse';
import { UpdateCustomerRequest } from '../models/customers/UpdateCustomerRequest';
import { UpdateCustomerResponse } from '../models/customers/UpdateCustomerResponse';

export const createCustomer = async (
  accessToken: string,
  request: CreateCustomerRequest
): Promise<ApiResponse> => {
  const URL = `${process.env.API_URL}/customers`;

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
      const createCustomerResponse: CreateCustomerResponse = await response.json();
      return new ApiResponse(true, response.status, createCustomerResponse);
    } else {
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};

export const updateCustomer = async (
  accessToken: string,
  request: UpdateCustomerRequest
): Promise<ApiResponse> => {
  const URL = `${process.env.API_URL}/customers/${request.customerId}`;

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
      const createCustomerResponse: UpdateCustomerResponse = await response.json();
      return new ApiResponse(true, response.status, createCustomerResponse);
    } else {
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};

export const getCustomerById = async (
  accessToken: string,
  customerId: string
): Promise<ApiResponse> => {
  const URL = `${process.env.API_URL}/customers/${customerId}`;

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
      const getCustomerResponse: GetCustomersResponse = await response.json();
      return new ApiResponse(true, response.status, getCustomerResponse);
    } else {
      const error = await response.json();
      return new ApiResponse(
        false,
        response.status,
        error.message,
        new ErrorDetails(error.message, response.status)
      );
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};

export const GetCustomers = async (
  accessToken: string | undefined,
  pageNumber: number,
  limit: number,
  customerName?: string,
  advancedFilters?: any
) => {
  let url = `${process.env.API_URL}/customers?pageNumber=${pageNumber}&limit=${limit}${
    customerName ? '&customerName=' + customerName : ''
  }`;

  url += `${
    advancedFilters?.startDate
      ? '&lastServiceStartDate=' + advancedFilters.startDate.toString()
      : ''
  }`;

  url += `${
    advancedFilters?.endDate ? '&lastServiceEndDate=' + advancedFilters.endDate.toString() : ''
  }`;

  if (advancedFilters?.serviceTypeIds && advancedFilters.serviceTypeIds.length > 0) {
    for (const serviceTypeId of advancedFilters.serviceTypeIds) {
      url += `&serviceTypeIds=${serviceTypeId}`;
    }
  }

  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  });

  if (response.ok) {
    const customers = await response.json();
    return customers as GetCustomersResponse;
  } else {
    console.log(`GetCustomers method Error:${response.statusText}`);
    return undefined;
  }
};
