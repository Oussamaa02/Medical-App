package com.demo.medapp.controllers;

import com.demo.medapp.dtos.AppointmentDto;
import com.demo.medapp.models.Appointment;
import com.demo.medapp.models.TimeSlot;
import com.demo.medapp.services.AppointmentService;
import com.demo.medapp.services.DoctorService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/doctor")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")

public class DoctorController {
    private final DoctorService doctorService;
    private final AppointmentService appointmentService;

    @GetMapping("/appointments")
    public List<AppointmentDto> findAllAppointments(
        HttpServletRequest request
    ){
        return appointmentService.getAllAppointmentsForDoctor(request);
    }

    @PostMapping("/availability")
    public void addTimeSlot(
            @RequestBody LocalTime startTime,
            HttpServletRequest request
    ){
         doctorService.addTimeSlot(startTime,request);
    }

    @DeleteMapping("/availability")
    public void deleteTimeSlot(
            @RequestBody LocalTime startTime,
            HttpServletRequest request
    ){
        doctorService.deleteTimeSlot(startTime,request);
    }

    @PutMapping("/appointments/{id}")
    public void cancelAppointment(
            @PathVariable("id") Long appointmentId,
            HttpServletRequest request
    ){
        appointmentService.doctorCancelAppointment(appointmentId,request);
    }

}
