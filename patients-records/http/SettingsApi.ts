import { ApiResponse } from '../models/Api/ApiResponse';
import { ErrorDetails } from '../models/Api/ErrorDetails';
import GetAccountSettingsResponse from '../models/settings/accounts/GetAccountSettingsResponse';
import UpdateAccountSettingsRequest from '../models/settings/accounts/UpdateAccountSettingsRequest';
import UpdateAccountSettingsResponse from '../models/settings/accounts/UpdateAccountSettingsResponse';
import fetchWithTimeout from '../util/fetchWithTimeout';

export const getAccountSettings = async (accessToken: string): Promise<ApiResponse> => {
  const URL = `http://10.0.2.2:3006/settings/accounts`;

  const response = await fetchWithTimeout(URL, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    }
  });

  if (response.ok) {
    const responseBody: GetAccountSettingsResponse = await response.json();
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

export const updateAccountSettings = async (
  accessToken: string,
  request: UpdateAccountSettingsRequest
): Promise<ApiResponse> => {
  const URL = `http://10.0.2.2:3006/settings/accounts`;

  const response = await fetchWithTimeout(URL, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(request)
  });

  if (response.ok) {
    const responseBody: UpdateAccountSettingsResponse = await response.json();
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
