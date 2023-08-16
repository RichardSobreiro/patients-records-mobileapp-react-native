/* eslint-disable import/order */

/** @format */
import { GetServiceTypeResponse } from '../service-types/GetServiceTypesResponse';
import { GetServicePhotosResponse } from './GetServicePhotosResponse';

export class GetServiceByIdResponse {
  constructor(
    public serviceId: string,
    public customerId: string,
    public date: Date,
    public serviceTypes: GetServiceTypeResponse[],
    public beforeNotes?: string,
    public afterNotes?: string,
    public beforePhotos?: GetServicePhotosResponse[] | null,
    public afterPhotos?: GetServicePhotosResponse[] | null
  ) {}
}
