package com.demo.medapp.dtos;

import java.time.LocalTime;

public record TimeSlotDto(
        LocalTime startTime
) {
}
