import { ApiResponse } from '../models/Api/ApiResponse';
import { ErrorDetails } from '../models/Api/ErrorDetails';
import CreatePaymentRequest from '../models/settings/payments/CreatePaymentRequest';
import CreatePaymentResponse from '../models/settings/payments/CreatePaymentResponse';
import CreateUserPaymentMethodRequest from '../models/settings/payments/CreateUserPaymentMethodRequest';
import CreateUserPaymentMethodResponse from '../models/settings/payments/CreateUserPaymentMethodResponse';
import GetPaymentInstalmentResponse from '../models/settings/payments/GetPaymentInstalmentResponse';
import GetUserPaymentMethodsResponse from '../models/settings/payments/GetUserPaymentMethodsResponse';
import fetchWithTimeout from '../util/fetchWithTimeout';

export const createPaymentMethod = async (
  accessToken: string,
  request: CreateUserPaymentMethodRequest
): Promise<ApiResponse> => {
  const URL = `http://10.0.2.2:3006/payments/methods`;

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
    const responseBody: CreateUserPaymentMethodResponse = await response.json();
    return new ApiResponse(true, response.status, responseBody);
  } else {
    return new ApiResponse(
      false,
      response.status,
      ``,
      new ErrorDetails(response.statusText, response.status)
    );
  }
};

export const getUserPaymentMethods = async (accessToken: string): Promise<ApiResponse> => {
  const URL = `http://10.0.2.2:3006/payments/methods`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  });

  if (response.ok) {
    const responseBody: GetUserPaymentMethodsResponse = await response.json();
    return new ApiResponse(true, response.status, responseBody);
  } else {
    return new ApiResponse(
      false,
      response.status,
      ``,
      new ErrorDetails(response.statusText, response.status)
    );
  }
};

export const createPayment = async (
  accessToken: string,
  request: CreatePaymentRequest
): Promise<ApiResponse> => {
  const URL = `http://10.0.2.2:3006/payments`;

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
    const responseBody: CreatePaymentResponse = await response.json();
    return new ApiResponse(true, response.status, responseBody);
  } else {
    return new ApiResponse(
      false,
      response.status,
      ``,
      new ErrorDetails(response.statusText, response.status)
    );
  }
};

export const getPaymentInstalment = async (
  accessToken: string,
  paymentInstalmentsId: string
): Promise<ApiResponse> => {
  const URL = `http://10.0.2.2:3006/payments/instalments/${paymentInstalmentsId}`;

  const response = await fetch(URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  });

  if (response.ok) {
    const responseBody: GetPaymentInstalmentResponse = await response.json();
    return new ApiResponse(true, response.status, responseBody);
  } else {
    return new ApiResponse(
      false,
      response.status,
      ``,
      new ErrorDetails(response.statusText, response.status)
    );
  }
};
