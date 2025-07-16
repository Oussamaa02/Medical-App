package com.demo.medapp.dtos;

public record DoctorAdminResponseDto(
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String licenseNumber,
        String speciality,
        LocationDto location,
        boolean isValidated

) {
}
