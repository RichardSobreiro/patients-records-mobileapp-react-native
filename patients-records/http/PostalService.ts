/** @format */
import { ApiResponse } from '../models/Api/ApiResponse';
import { ErrorDetails } from '../models/Api/ErrorDetails';
import { PostalServiceResponse } from '../models/postal-service/PostalServiceResponse';

export const getCepInfo = async (CEP: string): Promise<ApiResponse> => {
  CEP = CEP.replace(/[^\d]+/g, '');
  const URL = `https://viacep.com.br/ws/${CEP}/json
`;
  try {
    const response = await fetch(URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      }
    });

    if (response.ok) {
      const postalServiceResponse: PostalServiceResponse = await response.json();
      return new ApiResponse(true, response.status, postalServiceResponse);
    } else {
      const errorMessage: string = await response.json();
      return new ApiResponse(
        false,
        response.status,
        errorMessage,
        new ErrorDetails(errorMessage, response.status)
      );
    }
  } catch (error: any) {
    const msg: string = 'Erro ao buscar as informações do CEP. Faça o preenchimento manualmente!';
    return new ApiResponse(false, 400, msg, new ErrorDetails(msg, 400));
  }
};
