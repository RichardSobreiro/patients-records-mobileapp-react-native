/** @format */
import { ErrorDetails } from './ErrorDetails';

export class ApiResponse {
  constructor(
    public ok: boolean,
    public httpStatusCode: number | string | null | undefined,
    public body?: any,
    public error?: ErrorDetails,
    public comments?: string
  ) {}
}
