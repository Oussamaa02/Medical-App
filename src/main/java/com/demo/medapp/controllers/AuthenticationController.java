package com.demo.medapp.controllers;

import com.demo.medapp.auth.*;
import com.demo.medapp.models.User;

import com.demo.medapp.repos.UserRepository;
import com.demo.medapp.repos.VerificationTokenRepository;
import com.demo.medapp.services.AuthenticationService;
import com.demo.medapp.services.JwtService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class AuthenticationController {

    private final AuthenticationService service;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @PostMapping("/register/patient")
    public ResponseEntity<?> registerPatient(
            @RequestBody @Valid RegisterRequestPatient requestPatient,
            HttpServletResponse response
    ) {
        service.registerPatient(requestPatient, response);
        return ResponseEntity.ok().body(Map.of("message", "Check your email for verification"));
    }

    @PostMapping("/register/doctor")
    public ResponseEntity<?> registerDoctor(
            @RequestBody @Valid RegisterRequestDoctor requestDoctor,
            HttpServletResponse response
    ) {
        service.registerDoctor(requestDoctor, response);
        return ResponseEntity.ok().body(Map.of("message", "Check your email for verification"));
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verify(@RequestParam String token, HttpServletResponse response) {
        try {
            service.verifyAccount(token, response);
            return ResponseEntity.ok("Your account has been verified.");
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(
            @RequestBody @Valid AuthenticationRequest request,
            HttpServletResponse response
    ) {
        service.authenticate(request, response);
        return ResponseEntity.ok().body(Map.of("message", "Login successful"));
    }

    @GetMapping("/status")
    public ResponseEntity<?> checkLoginStatus(HttpServletRequest request) {
        if (request.getCookies() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Optional<String> jwtOpt = Arrays.stream(request.getCookies())
                .filter(c -> "jwt".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst();

        if (jwtOpt.isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String jwt = jwtOpt.get();
        String email = jwtService.extractUsername(jwt);
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null || !jwtService.isTokenValid(jwt, user)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        return ResponseEntity.ok(Map.of(
                "email", user.getEmail(),
                "role", user.getRole().name()
        ));
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