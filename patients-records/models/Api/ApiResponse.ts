/** @format */
import { ErrorDetails } from './ErrorDetails';

export class ApiResponse {
  constructor(
    public ok: boolean,
    public httpStatusCode: string | number,
    public body?: any,
    public error?: ErrorDetails,
    public comments?: string
  ) {}
}
