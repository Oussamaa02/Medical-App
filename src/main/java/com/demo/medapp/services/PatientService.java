package com.demo.medapp.services;

import com.demo.medapp.dtos.DoctorPatientResponseDto;
import com.demo.medapp.dtos.TimeSlotDto;
import com.demo.medapp.dtos.requests.RegisterRequestPatient;
import com.demo.medapp.enums.Status;
import com.demo.medapp.mappers.DoctorMapper;
import com.demo.medapp.mappers.TimeSlotMapper;
import com.demo.medapp.models.Appointment;
import com.demo.medapp.models.Doctor;
import com.demo.medapp.models.Patient;
import com.demo.medapp.models.TimeSlot;
import com.demo.medapp.repos.AppointmentRepository;
import com.demo.medapp.repos.DoctorRepository;
import com.demo.medapp.repos.PatientRepository;
import com.demo.medapp.repos.TimeSlotRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jdk.jfr.Frequency;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PatientService {
    private final TimeSlotRepository timeSlotRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DoctorMapper doctorMapper;
    private final AppointmentRepository appointmentRepository;
    private final JwtService jwtService;
    private final TimeSlotMapper timeSlotMapper;
    private final PasswordEncoder passwordEncoder;

    public Patient getCurrentPatient(HttpServletRequest request){
        if (request.getCookies() == null) {
            throw new IllegalArgumentException("Unauthorized patient!");
        }

        Optional<String> jwtOpt = Arrays.stream(request.getCookies())
                .filter(c -> "jwt".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst();

        if (jwtOpt.isEmpty()) {
            throw new IllegalArgumentException("Unauthorized patient!");
        }

        String jwt = jwtOpt.get();
        String email = jwtService.extractUsername(jwt);
        Patient patient = patientRepository.findByEmail(email).orElse(null);

        if (patient == null || !jwtService.isTokenValid(jwt, patient)) {
            throw new IllegalArgumentException("Unauthorized patient!");
        }
        return patient;
    }

    public List<DoctorPatientResponseDto> findAvailableDoctors (){
        return doctorRepository.findAll()
                .stream()
                .map(doctorMapper::toDoctorPatientResponseDto)
                .collect(Collectors.toList());
    }

    public void editProfile(RegisterRequestPatient request, HttpServletRequest httpServletRequest) {
        Patient patient = getCurrentPatient(httpServletRequest);

        if (request.getFirstName() != null && !request.getFirstName().trim().isEmpty()) {
            patient.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null && !request.getLastName().trim().isEmpty()) {
            patient.setLastName(request.getLastName());
        }

        if (request.getEmail() != null && !request.getEmail().trim().isEmpty() && !request.getEmail().equals(patient.getEmail())) {
            if (patientRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email is already in use");
            }
            patient.setEmail(request.getEmail());
        }

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            patient.setPassword(encodedPassword);
        }

        if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
            patient.setPhoneNumber(request.getPhoneNumber());
        }

        if (request.getAge() > 0 && request.getAge() < 110) {
            patient.setAge(request.getAge());
        }

        if ("Male".equals(request.getGender()) || "Female".equals(request.getGender())) {
            patient.setGender(request.getGender());
        }

        patientRepository.save(patient);
    }

    public DoctorPatientResponseDto getDoctorInfo(Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));
        return doctorMapper.toDoctorPatientResponseDto(doctor);
    }

}
