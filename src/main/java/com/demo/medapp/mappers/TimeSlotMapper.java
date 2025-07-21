package com.demo.medapp.mappers;

import com.demo.medapp.dtos.TimeSlotDto;
import com.demo.medapp.models.TimeSlot;
import org.springframework.stereotype.Service;

@Service
public class TimeSlotMapper {
    public TimeSlotDto toTimeSlotDto(TimeSlot timeSlot){
        return new TimeSlotDto(
                timeSlot.getStartTime()
        );
    }
}
