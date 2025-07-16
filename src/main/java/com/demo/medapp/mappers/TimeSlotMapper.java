package com.demo.medapp.mappers;

import com.demo.medapp.dtos.PatientAdminResponseDto;
import com.demo.medapp.dtos.TimeSlotDto;
import com.demo.medapp.models.Patient;
import com.demo.medapp.models.TimeSlot;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
public class TimeSlotMapper {
    public TimeSlotDto toTimeSlotDto(TimeSlot timeSlot){
        return new TimeSlotDto(
                timeSlot.getStartTime()
        );
    }
}
