package com.demo.medapp.mappers;

import com.demo.medapp.dtos.PatientResponseDto;
import com.demo.medapp.models.Patient;
import org.springframework.stereotype.Service;

@Service
public class PatientMapper {

    public PatientResponseDto toPatientAdminResponseDto(Patient patient){
        return new PatientResponseDto(
                patient.getFirstName(),
                patient.getLastName(),
                patient.getEmail(),
                patient.getAge(),
                patient.getPhoneNumber(),
                patient.getGender()
        );
    }

}
