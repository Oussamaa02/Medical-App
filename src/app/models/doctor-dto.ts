import { LocationDto } from './location-dto.model';

export interface Doctor {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  speciality: string;
  location: LocationDto;
  licenseNumber: string;
  isValidated: boolean;
  isPending: boolean;
}