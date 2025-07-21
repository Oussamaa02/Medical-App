package com.demo.medapp.dtos;

import com.demo.medapp.enums.Status;

import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentPatientDto(
        Long id,
        LocalDate date,
        LocalTime time,
        DoctorPatientResponseDto doctor,
        Status status
) {
}
