package com.demo.medapp.controllers;

import com.demo.medapp.dtos.AppointmentAdminDto;
import com.demo.medapp.dtos.AppointmentPatientDto;
import com.demo.medapp.dtos.DoctorAdminResponseDto;
import com.demo.medapp.dtos.PatientResponseDto;
import com.demo.medapp.dtos.requests.AdminRequest;
import com.demo.medapp.dtos.requests.RegisterRequestDoctor;
import com.demo.medapp.mappers.AdminMapper;
import com.demo.medapp.services.AdminService;
import com.demo.medapp.services.AppointmentService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AdminController {

    private final AdminService service;
    private final AppointmentService appointmentService;
    private final AdminService adminService;
    private final AdminMapper adminMapper;

    @GetMapping("/info")
    public AdminRequest getAdminInfo(HttpServletRequest request){
        return adminMapper.toAdminResponseDto(adminService.getCurrentUser(request));
    }

    @GetMapping("/patients")
    public List<PatientResponseDto> getPatients() {
        return service.findAllPatients();
    }

    @GetMapping("/doctors")
    public List<DoctorAdminResponseDto> getDoctors() {
        return service.findAllDoctors();
    }

    @GetMapping("/appointments")
    public List<AppointmentAdminDto> findAllAppointments(HttpServletRequest request){
        return appointmentService.getAllAppointmentsForAdmin(request);
    }

    @PostMapping("/validate")
    public void validateUser(@RequestParam String email) {
        service.validateDoctor(email);
    }

    @DeleteMapping("/remove-doctor")
    public void removeDoctor(@RequestParam String email){
        service.removeDoctor(email);
    }

    @DeleteMapping("/remove-patient")
    public void removePatient(@RequestParam String email){
        service.removePatient(email);
    }

    @PutMapping("/profile")
    public ResponseEntity<String> editProfile(
            @RequestBody AdminRequest request,
            HttpServletRequest httpRequest,
            HttpServletResponse httpResponse
    ) {
        try {
            adminService.editProfile(request, httpRequest, httpResponse);
            return ResponseEntity.ok("Profile updated successfully");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}