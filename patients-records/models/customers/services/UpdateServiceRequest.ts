/** @format */
import { GetServiceTypeResponse } from '../service-types/GetServiceTypesResponse';

type FileCustom = {
  id?: string;
  file: File;
  url?: string;
  name?: string;
};

/** @format */
export class UpdateServiceRequest {
  constructor(
    public serviceId: string,
    public date: Date,
    public durationHours: number,
    public durationMinutes: number,
    public serviceTypes: GetServiceTypeResponse[],
    public status: string,
    public sendReminder: boolean,
    public reminderMessageAdvanceTime: number,
    public beforeNotes?: string,
    public beforePhotos?: FileCustom[],
    public afterNotes?: string,
    public afterPhotos?: FileCustom[]
  ) {}
}
