package com.demo.medapp.mappers;

import com.demo.medapp.dtos.PatientDto;
import com.demo.medapp.models.Patient;
import org.springframework.stereotype.Service;

@Service
public class PatientMapper {
//    public Patient toPatient(PatientDto dto){
//        var patient = new Patient();
//        patient.setFirstName(dto.firstName());
//        patient.setLastName(dto.lastName());
//        patient.setAge(dto.age());
//        patient.setGender(dto.gender());
//        patient.setEmail(dto.email());
//        patient.setPhoneNumber(dto.phoneNumber());
//
//
//        var user = new User();
//        user.setId(patient.getId());
//
//        return patient;
//    }

    public PatientDto toPatientResponseDto(Patient patient){
        return new PatientDto(
                patient.getFirstName(),
                patient.getLastName(),
                patient.getEmail(),
                patient.getAge(),
                patient.getPhoneNumber(),
                patient.getGender()
        );
    }

//    public SchoolDto toSchoolDto(School school){
//        return new SchoolDto(
//                school.getId(),
//                school.getName()
//        );
//    }

}
