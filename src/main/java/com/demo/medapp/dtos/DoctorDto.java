package com.demo.medapp.dtos;

import com.demo.medapp.models.Location;

public record DoctorDto(
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
