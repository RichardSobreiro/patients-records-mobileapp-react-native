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
    public serviceTypes: GetServiceTypeResponse[],
    public beforeNotes?: string,
    public beforePhotos?: FileCustom[],
    public afterNotes?: string,
    public afterPhotos?: FileCustom[]
  ) {}
}
