/** @format */
import FileCustom from '../../../util/types/FileCustom';
import { GetServiceTypeResponse } from '../service-types/GetServiceTypesResponse';

export class CreateServiceRequest {
  constructor(
    public date: Date,
    public serviceTypes: GetServiceTypeResponse[],
    public beforeNotes?: string,
    public beforePhotos?: FileCustom[],
    public afterNotes?: string,
    public afterPhotos?: FileCustom[]
  ) {}
}
