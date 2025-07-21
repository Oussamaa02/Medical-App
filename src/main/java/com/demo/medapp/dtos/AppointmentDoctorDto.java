package com.demo.medapp.dtos;

import com.demo.medapp.enums.Status;

import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentDoctorDto(
        Long id,
        LocalDate date,
        LocalTime time,
        PatientResponseDto patient,
        Status status
) {
}
