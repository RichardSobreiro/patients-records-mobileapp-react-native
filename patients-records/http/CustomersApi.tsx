import { CreatePatientRequest } from '../models/CreatePatientRequest';
import { CreatePatientResponse } from '../models/CreatePatientResponse';
import { GetCustomer, GetCustomersResponse } from '../models/GetCustomersResponse';
import axios from 'axios';
import { UpdatePatientRequest } from 'models/UpdatePatientRequest';
import { UpdatePatientResponse } from 'models/UpdatePatientResponse';

export const createNewPatient = async (request: CreatePatientRequest) => {
  const url = `${process.env.API_URL}/customers`;

  const response: CreatePatientResponse | undefined = await axios
    .post(url, request)
    .then((response) => {
      return response.data as CreatePatientResponse;
    })
    .catch((err) => {
      console.log(`createNewPatient method Error:${err}`);
      return undefined;
    });

  return response;
};

export const updatePatient = async (request: UpdatePatientRequest) => {
  const url = `${process.env.API_URL}/customers/${request.patientId}`;

  const response: UpdatePatientResponse | undefined = await axios
    .put(url, request)
    .then((response) => {
      return response.data as UpdatePatientResponse;
    })
    .catch((err) => {
      console.log(`updatePatient method Error:${err}`);
      return undefined;
    });

  return response;
};

export const GetCustomerById = async (patientId: string) => {
  const url = `${process.env.API_URL}/customers/${patientId}`;

  const response: GetCustomer | undefined = await axios
    .get(url)
    .then((response) => {
      return response.data as GetCustomer;
    })
    .catch((err) => {
      console.log(`GetCustomerById method Error:${err}`);
      return undefined;
    });

  return response;
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
      ? '&lastServiceStartDate=' + advancedFilters.startDate.toLocaleString()
      : ''
  }`;

  url += `${
    advancedFilters?.endDate
      ? '&lastServiceEndDate=' + advancedFilters.endDate.toLocaleString()
      : ''
  }`;

  url += `${
    advancedFilters?.proceedingTypeId
      ? '&proceedingTypeId=' + advancedFilters?.proceedingTypeId
      : ''
  }`;

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
