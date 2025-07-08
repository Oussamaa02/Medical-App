package com.demo.medapp.controllers;

import com.demo.medapp.auth.AuthenticationRequest;
import com.demo.medapp.auth.RegisterRequestDoctor;
import com.demo.medapp.auth.RegisterRequestPatient;
import com.demo.medapp.services.AuthenticationService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200",allowCredentials = "true")
public class AuthenticationController {

    private final AuthenticationService service;

    @PostMapping("/register/patient")
    public ResponseEntity<?> registerPatient(
            @RequestBody @Valid RegisterRequestPatient requestPatient,
            HttpServletResponse response
    ) {
        service.registerPatient(requestPatient, response);
        return ResponseEntity.ok().body(Map.of("message", "Registration successful"));
    }

    @PostMapping("/register/doctor")
    public ResponseEntity<?> registerDoctor(
            @RequestBody @Valid RegisterRequestDoctor requestDoctor,
            HttpServletResponse response
    ) {
        service.registerDoctor(requestDoctor, response);
        return ResponseEntity.ok().body(Map.of("message", "Registration successful"));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(
            @RequestBody @Valid AuthenticationRequest request,
            HttpServletResponse response
    ) {
        service.authenticate(request, response);
        return ResponseEntity.ok().body(Map.of("message", "Login successful"));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        service.clearAuthCookie(response);
        return ResponseEntity.ok().body(Map.of("message", "Logout successful"));
    }

    @PostMapping("/refresh-token")
    public void refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ){
        service.refreshToken(request,response);
    }

    @GetMapping("/csrf-token")
    public ResponseEntity<?> getCsrfToken(HttpServletRequest request) {
        return ResponseEntity.ok().build();
    }
}