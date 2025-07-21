package com.demo.medapp.mappers;

import com.demo.medapp.dtos.DoctorAdminResponseDto;
import com.demo.medapp.dtos.DoctorPatientResponseDto;
import com.demo.medapp.models.Doctor;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DoctorMapper {
    private final LocationMapper locationMapper;

    public DoctorAdminResponseDto toDoctorAdminResponseDto(Doctor doctor){
        return new DoctorAdminResponseDto(
                doctor.getFirstName(),
                doctor.getLastName(),
                doctor.getEmail(),
                doctor.getPhoneNumber(),
                doctor.getLicenseNumber(),
                doctor.getSpeciality(),
                locationMapper.toLocationResponseDto(doctor.getLocation()),
                doctor.isValidated(),
                doctor.isPending()
        );
    }

    public DoctorPatientResponseDto toDoctorPatientResponseDto(Doctor doctor){
        return new DoctorPatientResponseDto(
                doctor.getId(),
                doctor.getFirstName(),
                doctor.getLastName(),
                doctor.getEmail(),
                doctor.getPhoneNumber(),
                doctor.getSpeciality(),
                locationMapper.toLocationResponseDto(doctor.getLocation())
        );
    }
}
