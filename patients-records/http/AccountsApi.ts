import { ApiResponse } from '../models/Api/ApiResponse';
import { ErrorDetails } from '../models/Api/ErrorDetails';
import { CreateUserRequest } from '../models/user/CreateUserRequest';
import { CreateUserResponse } from '../models/user/CreateUserResponse';
import fetchWithTimeout from '../util/fetchWithTimeout';

export const createUser = async (request: CreateUserRequest): Promise<ApiResponse> => {
  const URL_ADDRESS = `http://10.0.2.2:3005/users`;

  const formBody: any = [];
  formBody.push(encodeURIComponent('email') + '=' + encodeURIComponent(request.email));
  formBody.push(encodeURIComponent('username') + '=' + encodeURIComponent(request.username));
  request.password &&
    formBody.push(encodeURIComponent('password') + '=' + encodeURIComponent(request.password));

  const formBodyString = formBody.join('&');

  const response = await fetch(URL_ADDRESS, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Accept: 'application/json'
    },
    body: formBodyString
  });

  if (response.ok) {
    const responseBody: CreateUserResponse = await response.json();
    return new ApiResponse(true, response.status + '', responseBody);
  } else {
    const errrorBody: any = await response.json();
    return new ApiResponse(
      false,
      response.status + '',
      ``,
      new ErrorDetails(errrorBody.message, response.status)
    );
  }
};
