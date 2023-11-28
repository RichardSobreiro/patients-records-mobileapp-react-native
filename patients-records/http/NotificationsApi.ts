/** @format */
import { ApiResponse } from '../models/Api/ApiResponse';
import { ErrorDetails } from '../models/Api/ErrorDetails';
import GetNotificationsResponse from '/models/notifications/GetNotificationsResponse';

export const getUserNotifications = async (
  accessToken: string,
  pageNumber: string,
  limit: string
): Promise<ApiResponse> => {
  const URL = `http://10.0.2.2:3006/notifications?pageNumber=${pageNumber}&limit=${limit}`;

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
      const responseBody: GetNotificationsResponse = await response.json();
      return new ApiResponse(true, response.status, responseBody);
    } else {
      return new ApiResponse(false, response.status, ``, new ErrorDetails(``, response.status));
    }
  } catch (error: any) {
    return new ApiResponse(false, 400, error.message, new ErrorDetails(error.message, 400));
  }
};
