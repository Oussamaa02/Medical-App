package com.demo.medapp.controllers;

import com.demo.medapp.dtos.DoctorDto;
import com.demo.medapp.dtos.PatientDto;
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
    public List<PatientDto> getPatients() {
        return service.findAllPatients();
    }

    @GetMapping("/doctors")
    public List<DoctorDto> getDoctors() {
        return service.findAllDoctors();
    }

    @PostMapping("/validate")
    public void validateUser(@RequestParam String email) {
        service.validateDoctor(email);
    }


    @PutMapping
    public String put() {
        return "PUT:: admin controller";
    }
    @DeleteMapping
    public String delete() {
        return "DELETE:: admin controller";
    }
}