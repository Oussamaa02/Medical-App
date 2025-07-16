package com.demo.medapp.mappers;

import com.demo.medapp.dtos.AppointmentDto;
import com.demo.medapp.dtos.TimeSlotDto;
import com.demo.medapp.models.Appointment;
import com.demo.medapp.models.TimeSlot;
import org.springframework.stereotype.Service;

@Service
public class AppointmentMapper {
    public AppointmentDto toAppointmentDto(Appointment appointment){
        return new AppointmentDto(
                appointment.getDate(),
                appointment.getTime(),
                appointment.getStatus()
        );
    }
}
