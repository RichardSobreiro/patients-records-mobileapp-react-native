/** @format */

export class ErrorDetails {
  constructor(
    public message: string,
    public httpStatusCode?: string | number,
    public comments?: string,
    public stackTrace?: string
  ) {}
}
