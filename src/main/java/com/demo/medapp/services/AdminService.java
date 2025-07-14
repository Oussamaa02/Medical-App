package com.demo.medapp.services;

import com.demo.medapp.dtos.DoctorDto;
import com.demo.medapp.dtos.PatientDto;
import com.demo.medapp.mappers.DoctorMapper;
import com.demo.medapp.mappers.PatientMapper;
import com.demo.medapp.repos.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
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

    public List<PatientDto> findAllPatients (){
        return patientRepository.findAll()
                .stream()
                .map(patientMapper::toPatientResponseDto)
                .collect(Collectors.toList());
    }

    public List<DoctorDto> findAllDoctors (){
        return doctorRepository.findAll()
                .stream()
                .map(doctorMapper::toDoctorResponseDto)
                .collect(Collectors.toList());
    }

    public void validateDoctor(String email){
        var user = userRepository.findByEmail(email).orElseThrow();
        long id = user.getId();
            var token = verificationTokenRepository.findByDoctorId(id).orElseThrow();
            emailService.sendVerificationEmail(user.getEmail(), token.getToken());



    }

}
