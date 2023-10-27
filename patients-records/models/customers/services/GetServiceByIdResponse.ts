/* eslint-disable import/order */

/** @format */
import { GetServiceTypeResponse } from '../service-types/GetServiceTypesResponse';
import { GetServicePhotosResponse } from './GetServicePhotosResponse';

export class GetServiceByIdResponse {
  constructor(
    public serviceId: string,
    public customerId: string,
    public date: Date,
    public durationHours: number,
    public durationMinutes: number,
    public serviceTypes: GetServiceTypeResponse[],
    public status: string,
    public sendReminder: boolean,
    public reminderMessageAdvanceTime: number,
    public beforeNotes?: string,
    public afterNotes?: string,
    public beforePhotos?: GetServicePhotosResponse[] | null,
    public afterPhotos?: GetServicePhotosResponse[] | null
  ) {}
}
