package com.demo.medapp.controllers;

import com.demo.medapp.dtos.AppointmentDto;
import com.demo.medapp.dtos.TimeSlotDto;
import com.demo.medapp.dtos.requests.BookAppointmentRequest;
import com.demo.medapp.dtos.DoctorPatientResponseDto;
import com.demo.medapp.models.Appointment;
import com.demo.medapp.models.TimeSlot;
import com.demo.medapp.services.AppointmentService;
import com.demo.medapp.services.PatientService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/patient")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class PatientController {
    private final PatientService patientService;
    private final AppointmentService appointmentService;

    @GetMapping("/doctors/{id}")
    public List<TimeSlotDto> findAvailableTimes(
            @PathVariable("id") long doctorId
    ){
        return patientService.findDoctorAvailableTimes(doctorId);
    }

    @GetMapping("/doctors")
    public List<DoctorPatientResponseDto>  findAvailableDoctors(){
        return patientService.findAvailableDoctors();
    }

    @GetMapping("/appointments")
    public List<AppointmentDto> findAllAppointments(HttpServletRequest request){
        return appointmentService.getAllAppointmentsForPatient(request);
    }

    @GetMapping("/appointments/booked")
    public List<AppointmentDto> findAllBookedAppointments(HttpServletRequest request){
        return appointmentService.getBookedAppointmentsForPatient(request);
    }

    @GetMapping("/appointments/canceled")
    public List<AppointmentDto> findAllCanceledAppointments(HttpServletRequest request){
        return appointmentService.getCanceledAppointmentsForPatient(request);
    }

    @GetMapping("/appointments/rescheduled")
    public List<AppointmentDto> findAllRescheduledAppointments(HttpServletRequest request){
        return appointmentService.getRescheduledAppointmentsForPatient(request);
    }

    @PostMapping("/doctors/{id}")
    public void bookAppointment(
            @RequestBody BookAppointmentRequest bookAppointment,
            @PathVariable("id") long doctorId,
            HttpServletRequest request
    ){
        appointmentService.patientBookAppointment(
                bookAppointment.getStartTime(),
                bookAppointment.getDate(),
                doctorId,request);
    }

    @PutMapping("/appointments/{id}/cancel")
    public void cancelAppointment(
            @PathVariable("id") Long appointmentId,
            HttpServletRequest request
    ){
        appointmentService.patientCancelAppointment(appointmentId,request);
    }

    @PutMapping("/appointments/{id}/reschedule")
    public void rescheduleAppointment(
            @PathVariable("id") Long appointmentId,
            @RequestBody BookAppointmentRequest rescheduleAppointment,
            long doctorId,
            HttpServletRequest request
    ){
        appointmentService.patientRescheduleAppointment(
                appointmentId,
                rescheduleAppointment.getDate(),
                rescheduleAppointment.getStartTime(),
                doctorId,request);
    }
}
