package com.demo.medapp.mappers;

import com.demo.medapp.dtos.PatientAdminResponseDto;
import com.demo.medapp.models.Patient;
import org.springframework.stereotype.Service;

@Service
public class PatientMapper {

    public PatientAdminResponseDto toPatientAdminResponseDto(Patient patient){
        return new PatientAdminResponseDto(
                patient.getFirstName(),
                patient.getLastName(),
                patient.getEmail(),
                patient.getAge(),
                patient.getPhoneNumber(),
                patient.getGender()
        );
    }

}
