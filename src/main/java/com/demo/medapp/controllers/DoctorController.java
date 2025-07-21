package com.demo.medapp.controllers;

import com.demo.medapp.dtos.AppointmentDoctorDto;
import com.demo.medapp.dtos.DoctorPatientResponseDto;
import com.demo.medapp.dtos.TimeSlotDto;
import com.demo.medapp.dtos.requests.RegisterRequestDoctor;
import com.demo.medapp.dtos.requests.RegisterRequestPatient;
import com.demo.medapp.mappers.DoctorMapper;
import com.demo.medapp.services.AppointmentService;
import com.demo.medapp.services.DoctorService;
import com.demo.medapp.services.TimeSlotService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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
    private final DoctorMapper doctorMapper;
    private final TimeSlotService timeSlotService;

    @GetMapping("/info")
    public DoctorPatientResponseDto getDoctorInfo(HttpServletRequest request){
        return doctorMapper.toDoctorPatientResponseDto(doctorService.getCurrentDoctor(request));
    }

    @GetMapping("/availability")
    public List<TimeSlotDto> findAllTimeSlots(
            HttpServletRequest request
    ){
        return timeSlotService.getAllTimeSlotsForDoctor(request);
    }

    @GetMapping("/appointments")
    public List<AppointmentDoctorDto> findAllAppointments(
        HttpServletRequest request
    ){
        return appointmentService.getAllAppointmentsForDoctor(request);
    }

    @PostMapping("/availability")
    public void addTimeSlot(
            @RequestBody LocalTime startTime,
            HttpServletRequest request
    ){
         timeSlotService.addTimeSlot(startTime,request);
    }

    @DeleteMapping("/availability")
    public void deleteTimeSlot(
            @RequestBody LocalTime startTime,
            HttpServletRequest request
    ){
        timeSlotService.deleteTimeSlot(startTime,request);
    }

    @PutMapping("/appointments/{id}")
    public void cancelAppointment(
            @PathVariable("id") Long appointmentId,
            HttpServletRequest request
    ){
        appointmentService.doctorCancelAppointment(appointmentId,request);
    }

    @PutMapping("/profile")
    public ResponseEntity<String> editProfile(
            @RequestBody RegisterRequestDoctor request,
            HttpServletRequest httpRequest
    ) {
        try {
            doctorService.editProfile(request, httpRequest);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

}
