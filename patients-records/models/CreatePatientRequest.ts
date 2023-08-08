export class CreatePatientRequest {
  constructor(
    public userId: string,
    public patientName: string,
    public phoneNumber: string,
    public birthDate: Date,
    public email?: string
  ) {}
}
