package com.demo.medapp.controllers;

import com.demo.medapp.dtos.DoctorAdminResponseDto;
import com.demo.medapp.dtos.PatientAdminResponseDto;
import com.demo.medapp.services.AdminService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AdminController {

    private final AdminService service;

    @GetMapping("/patients")
    public List<PatientAdminResponseDto> getPatients() {
        return service.findAllPatients();
    }

    @GetMapping("/doctors")
    public List<DoctorAdminResponseDto> getDoctors() {
        return service.findAllDoctors();
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
}