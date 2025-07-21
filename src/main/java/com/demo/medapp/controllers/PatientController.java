package com.demo.medapp.controllers;

import com.demo.medapp.dtos.AppointmentPatientDto;
import com.demo.medapp.dtos.PatientResponseDto;
import com.demo.medapp.dtos.TimeSlotDto;
import com.demo.medapp.dtos.requests.BookAppointmentRequest;
import com.demo.medapp.dtos.DoctorPatientResponseDto;
import com.demo.medapp.dtos.requests.RegisterRequestPatient;
import com.demo.medapp.mappers.PatientMapper;
import com.demo.medapp.services.AppointmentService;
import com.demo.medapp.services.PatientService;
import com.demo.medapp.services.TimeSlotService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/patient")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class PatientController {
    private final PatientService patientService;
    private final TimeSlotService timeSlotService;
    private final AppointmentService appointmentService;
    private final PatientMapper patientMapper;

    @GetMapping("/info")
    public PatientResponseDto getPatientInfo(HttpServletRequest request){
        return patientMapper.toPatientAdminResponseDto(patientService.getCurrentPatient(request));
    }

    @GetMapping("/doctors/{id}")
    public List<TimeSlotDto> findAvailableTimes(
            @PathVariable("id") long doctorId,
            @RequestParam("date") LocalDate date
    ){
        return timeSlotService.getAvailableTimeSlots(date,doctorId);
    }

    @GetMapping("/doctors")
    public List<DoctorPatientResponseDto>  findAvailableDoctors(){
        return patientService.findAvailableDoctors();
    }

    @GetMapping("/doctor/{id}")
    public DoctorPatientResponseDto  getDoctorInfo(
            @PathVariable("id") long doctorId
    ){
        return patientService.getDoctorInfo(doctorId);
    }

    @GetMapping("/appointments")
    public List<AppointmentPatientDto> findAllAppointments(HttpServletRequest request){
        return appointmentService.getAllAppointmentsForPatient(request);
    }

    @GetMapping("/appointments/booked")
    public List<AppointmentPatientDto> findAllBookedAppointments(HttpServletRequest request){
        return appointmentService.getBookedAppointmentsForPatient(request);
    }

    @GetMapping("/appointments/canceled")
    public List<AppointmentPatientDto> findAllCanceledAppointments(HttpServletRequest request){
        return appointmentService.getCanceledAppointmentsForPatient(request);
    }

    @GetMapping("/appointments/rescheduled")
    public List<AppointmentPatientDto> findAllRescheduledAppointments(HttpServletRequest request){
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
            @RequestParam("doctorId") long doctorId,
            HttpServletRequest request
    ){
        appointmentService.patientRescheduleAppointment(
                appointmentId,
                rescheduleAppointment.getDate(),
                rescheduleAppointment.getStartTime(),
                doctorId,request);
    }

    @PutMapping("/profile")
    public ResponseEntity<String> editProfile(
            @RequestBody RegisterRequestPatient request,
            HttpServletRequest httpRequest
    ) {
        try {
            patientService.editProfile(request, httpRequest);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
