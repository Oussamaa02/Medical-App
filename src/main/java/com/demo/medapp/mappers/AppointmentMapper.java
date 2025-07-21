package com.demo.medapp.mappers;

import com.demo.medapp.dtos.*;
import com.demo.medapp.models.Appointment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AppointmentMapper {
    private final DoctorMapper doctorMapper;
    private final PatientMapper patientMapper;

    public AppointmentPatientDto toPatientAppointmentDto(Appointment appointment){
        DoctorPatientResponseDto doctorDto = doctorMapper.toDoctorPatientResponseDto(appointment.getDoctor());
        return new AppointmentPatientDto(
                appointment.getId(),
                appointment.getDate(),
                appointment.getTime(),
                doctorDto,
                appointment.getStatus()
        );
    }

    public AppointmentDoctorDto toDoctorAppointmentDto(Appointment appointment){
        PatientResponseDto patientDto = patientMapper.toPatientAdminResponseDto(appointment.getPatient());
        return new AppointmentDoctorDto(
                appointment.getId(),
                appointment.getDate(),
                appointment.getTime(),
                patientDto,
                appointment.getStatus()
        );
    }

    public AppointmentAdminDto toAdminAppointmentDto(Appointment appointment){
        PatientResponseDto patientDto = patientMapper.toPatientAdminResponseDto(appointment.getPatient());
        DoctorPatientResponseDto doctorDto = doctorMapper.toDoctorPatientResponseDto(appointment.getDoctor());
        return new AppointmentAdminDto(
                appointment.getId(),
                appointment.getDate(),
                appointment.getTime(),
                patientDto,
                doctorDto,
                appointment.getStatus()
        );
    }
}
