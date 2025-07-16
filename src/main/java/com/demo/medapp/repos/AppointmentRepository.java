package com.demo.medapp.repos;

import com.demo.medapp.dtos.AppointmentDto;
import com.demo.medapp.models.Appointment;
import com.demo.medapp.models.Doctor;
import com.demo.medapp.models.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface AppointmentRepository extends JpaRepository<Appointment,Long> {
    Optional<Appointment> findByDate(LocalDate date);
    List<Appointment> findByPatient (Patient patient);
    List<Appointment> findByDoctor (Doctor doctor);
}