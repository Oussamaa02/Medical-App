export interface EditPatientProfile {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string; 
    age?: number;
    phoneNumber?: string;
    gender?: string;
}

export interface EditDoctorProfile {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string; 
    phoneNumber?: string;
    licenseNumber?: string;
    speciality?: string;
    address?: string;
    city?: string;
    zipCode?: string;
}

export interface EditAdminProfile{
    email?: string;
    password?: string;
}

