package com.demo.medapp.mappers;

import com.demo.medapp.dtos.DoctorDto;
import com.demo.medapp.dtos.LocationDto;
import com.demo.medapp.dtos.PatientDto;
import com.demo.medapp.models.Doctor;
import com.demo.medapp.models.Patient;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DoctorMapper {
    private final LocationMapper locationMapper;

    public DoctorDto toDoctorResponseDto(Doctor doctor){
        return new DoctorDto(
                doctor.getFirstName(),
                doctor.getLastName(),
                doctor.getEmail(),
                doctor.getPhoneNumber(),
                doctor.getLicenseNumber(),
                doctor.getSpeciality(),
                locationMapper.toLocationResponseDto(doctor.getLocation()),
                doctor.isValidated()
        );
    }
}
