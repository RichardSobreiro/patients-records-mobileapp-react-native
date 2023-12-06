import { ApiResponse } from '../models/Api/ApiResponse';
import { ErrorDetails } from '../models/Api/ErrorDetails';
import CreateOTPRequest from '../models/security/CreateOTPRequest';
import CreateOTPResponse from '../models/security/CreateOTPResponse';

export const sendWelcomeEmailWithOTP = async (
  accessToken: string,
  request: CreateOTPRequest
): Promise<ApiResponse> => {
  const URL_ADDRESS = `http://10.0.2.2:3006/security/otp`;
  const response = await fetch(URL_ADDRESS, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(request)
  });

  if (response.ok) {
    const responseBody: CreateOTPResponse = await response.json();
    return new ApiResponse(true, response.status, responseBody);
  } else {
    const errorBody = await response.json();
    return new ApiResponse(
      false,
      errorBody.httpStatusCode,
      errorBody,
      new ErrorDetails(errorBody.message, errorBody.httpStatusCode)
    );
  }
};
