import { GetServicePhotosResponse } from '/models/customers/services/GetServicePhotosResponse';

type FileCustom = {
  id?: string;
  file: File;
  url?: string;
  name?: string;
};

export default FileCustom;

export const convertArrayPhotoApiToFileCustom = async (
  photosApiResponse: GetServicePhotosResponse[] | undefined | null,
  photoNamePrefix: string
): Promise<FileCustom[]> => {
  if (!photosApiResponse) {
    return [];
  }
  const fileCustomArray: FileCustom[] = [];
  for (let i = 0; i < photosApiResponse.length; i++) {
    const photoName = `${photoNamePrefix}-${i}`;
    const fileCustom = await convertPhotoApiToFileCustom(photosApiResponse[i], photoName);
    fileCustomArray.push(fileCustom);
  }
  return fileCustomArray;
};

export const convertPhotoApiToFileCustom = async (
  photoApiResponse: GetServicePhotosResponse,
  photoName: string
): Promise<FileCustom> => {
  const response = await fetch(photoApiResponse.url);
  const data = await response.blob();
  const metadata = {
    type: data.type
  };
  const photoFile = new File([data], photoName, metadata);
  return {
    file: photoFile,
    id: photoApiResponse.servicePhotoId,
    name: `${photoName}.${data.type.split('/')[1]}`,
    url: photoApiResponse.url
  };
};
