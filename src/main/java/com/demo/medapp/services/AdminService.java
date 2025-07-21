package com.demo.medapp.services;

import com.demo.medapp.dtos.DoctorAdminResponseDto;
import com.demo.medapp.dtos.PatientResponseDto;
import com.demo.medapp.dtos.requests.AdminRequest;
import com.demo.medapp.dtos.requests.RegisterRequestDoctor;
import com.demo.medapp.enums.Role;
import com.demo.medapp.mappers.DoctorMapper;
import com.demo.medapp.mappers.PatientMapper;
import com.demo.medapp.models.*;
import com.demo.medapp.repos.*;
import com.demo.medapp.tokens.Token;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final UserRepository userRepository;
    private final PatientMapper patientMapper;
    private final DoctorMapper doctorMapper;
    private final EmailService emailService;
    private final VerificationTokenRepository verificationTokenRepository;
    private final AppointmentRepository appointmentRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationService authenticationService;
    private final TokenRepository tokenRepository;

    public List<PatientResponseDto> findAllPatients (){
        return patientRepository.findAll()
                .stream()
                .map(patientMapper::toPatientAdminResponseDto)
                .collect(Collectors.toList());
    }

    public List<DoctorAdminResponseDto> findAllDoctors (){
        return doctorRepository.findAll()
                .stream()
                .map(doctorMapper::toDoctorAdminResponseDto)
                .collect(Collectors.toList());
    }

    public void validateDoctor(String email){
        var doctor = doctorRepository.findByEmail(email).orElseThrow();
        long id = doctor.getId();
        var token = verificationTokenRepository.findByDoctorId(id).orElseThrow();
        emailService.sendVerificationEmail(doctor.getEmail(), token.getToken());
        doctor.setPending(true);
        doctorRepository.save(doctor);
    }


    @Transactional
    public void removeDoctor(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        long id = user.getId();

        var doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Doctor entity not found"));

        List<Appointment> appointments = appointmentRepository.findByDoctor(doctor);
        appointmentRepository.deleteAll(appointments);

        List<Token> tokens = tokenRepository.findAllByUserId(id);
        tokenRepository.deleteAll(tokens);

        List<TimeSlot> timeSlots = timeSlotRepository.findByDoctorId(id);
        for (TimeSlot slot : timeSlots) {
            slot.getDoctors().remove(doctor);
            if (slot.getDoctors().isEmpty()) {
                timeSlotRepository.delete(slot);
            } else {
                timeSlotRepository.save(slot);
            }
        }

        doctorRepository.deleteById(id);
        userRepository.deleteById(id);
    }


    @Transactional
    public void removePatient(String email) {
        var user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Patient not found"));
        long id = user.getId();

        var patient = patientRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Patient entity not found"));

        List<Appointment> appointments = appointmentRepository.findByPatient(patient);
        appointmentRepository.deleteAll(appointments);

        List<Token> tokens = tokenRepository.findAllByUserId(id);
        tokenRepository.deleteAll(tokens);

        patientRepository.deleteById(id);
        userRepository.deleteById(id);
    }

    public User getCurrentUser(HttpServletRequest request){
        if (request.getCookies() == null) {
            throw new IllegalArgumentException("Invalid user!");
        }

        Optional<String> jwtOpt = Arrays.stream(request.getCookies())
                .filter(c -> "jwt".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst();

        if (jwtOpt.isEmpty()) {
            throw new IllegalArgumentException("Invalid user!");        }

        String jwt = jwtOpt.get();
        String email = jwtService.extractUsername(jwt);
        User user = userRepository.findByEmail(email).orElse(null);

        if (user == null || !jwtService.isTokenValid(jwt, user)) {
            throw new IllegalArgumentException("Invalid user!");        }

        return user;
    }

    @Transactional
    public void editProfile(AdminRequest request, HttpServletRequest httpServletRequest, HttpServletResponse httpServletResponse) {
        User admin = getCurrentUser(httpServletRequest);

        if(!admin.getRole().equals(Role.ADMIN)){
            throw new IllegalArgumentException("Access denied!");
        }


        if (request.getEmail() != null && !request.getEmail().trim().isEmpty() && !request.getEmail().equals(admin.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email already in use");
            }
            admin.setEmail(request.getEmail());
        }

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            admin.setPassword(encodedPassword);
        }

        userRepository.save(admin);
        authenticationService.clearAuthCookie(httpServletResponse,httpServletRequest);
    }

}
