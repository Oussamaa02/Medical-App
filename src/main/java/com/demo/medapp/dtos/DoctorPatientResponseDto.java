package com.demo.medapp.dtos;

public record DoctorPatientResponseDto(
        String firstName,
        String lastName,
        String email,
        String phoneNumber,
        String speciality,
        LocationDto location
) {
}
