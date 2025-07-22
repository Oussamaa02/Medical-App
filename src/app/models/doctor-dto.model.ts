import { LocationDto } from './location-dto.model';

export interface DoctorDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  licenseNumber: any;
  speciality: string;
  location: LocationDto;
}
