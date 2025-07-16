package com.demo.medapp.services;

import com.demo.medapp.dtos.DoctorPatientResponseDto;
import com.demo.medapp.dtos.TimeSlotDto;
import com.demo.medapp.mappers.DoctorMapper;
import com.demo.medapp.mappers.TimeSlotMapper;
import com.demo.medapp.models.Patient;
import com.demo.medapp.models.TimeSlot;
import com.demo.medapp.repos.AppointmentRepository;
import com.demo.medapp.repos.DoctorRepository;
import com.demo.medapp.repos.PatientRepository;
import com.demo.medapp.repos.TimeSlotRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

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

    public List<TimeSlot> listDoctorAvailableTimes (long doctorId){

        return timeSlotRepository.findByDoctorId(doctorId);

    }

    public List<TimeSlotDto> findDoctorAvailableTimes (long doctorId){

        return timeSlotRepository.findByDoctorId(doctorId)
                .stream()
                .map(timeSlotMapper::toTimeSlotDto)
                .collect(Collectors.toList());
    }

}
