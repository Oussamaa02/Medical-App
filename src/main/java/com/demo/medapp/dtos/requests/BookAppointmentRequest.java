package com.demo.medapp.dtos.requests;

import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class BookAppointmentRequest {
    private LocalTime startTime;
    private LocalDate date;
}
