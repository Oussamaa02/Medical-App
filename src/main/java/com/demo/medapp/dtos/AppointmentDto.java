package com.demo.medapp.dtos;

import com.demo.medapp.enums.Status;

import java.time.LocalDate;
import java.time.LocalTime;

public record AppointmentDto(
        LocalDate date,
        LocalTime time,
        Status status
) {
}
