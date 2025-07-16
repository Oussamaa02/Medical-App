package com.demo.medapp.services;

import com.demo.medapp.dtos.AppointmentDto;
import com.demo.medapp.enums.Status;
import com.demo.medapp.mappers.AppointmentMapper;
import com.demo.medapp.models.Appointment;
import com.demo.medapp.models.Doctor;
import com.demo.medapp.models.Patient;
import com.demo.medapp.models.TimeSlot;
import com.demo.medapp.repos.AppointmentRepository;
import com.demo.medapp.repos.DoctorRepository;
import com.demo.medapp.repos.PatientRepository;
import com.demo.medapp.repos.TimeSlotRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AppointmentService {
    private final DoctorService doctorService;
    private final PatientService patientService;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final AppointmentMapper appointmentMapper;

    //For patient
    @Transactional
    public void patientBookAppointment(LocalTime startTime, LocalDate date, long doctorId, HttpServletRequest request) {
        List<TimeSlot> timeSlots = patientService.listDoctorAvailableTimes(doctorId);

        Optional<TimeSlot> optionalTimeSlot = timeSlots
                .stream()
                .filter(slot -> slot.getStartTime().equals(startTime))
                .findFirst();

        if (optionalTimeSlot.isEmpty()) {
            throw new IllegalArgumentException("Time slot not found for this doctor");
        }

        TimeSlot timeSlot = optionalTimeSlot.get();

        if (!timeSlot.isAvailable()) {
            throw new IllegalArgumentException("Time slot is already booked");
        }

        Doctor doctor = doctorRepository.findById(doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found"));

        Patient patient = patientService.getCurrentPatient(request);

        Appointment appointment = Appointment.builder()
                .doctor(doctor)
                .patient(patient)
                .timeSlot(timeSlot)
                .time(timeSlot.getStartTime())
                .date(date)
                .status(Status.BOOKED)
                .build();

        appointmentRepository.save(appointment);

        timeSlot.setAvailable(false);
        timeSlotRepository.save(timeSlot);
    }

    @Transactional
    public void patientCancelAppointment(Long appointmentId, HttpServletRequest request) {
        Patient patient = patientService.getCurrentPatient(request);

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        if (appointment.getPatient().getId() != (patient.getId())) {
            throw new SecurityException("Unauthorized to cancel this appointment.");
        }

        appointment.setStatus(Status.CANCELED);

        TimeSlot slot = appointment.getTimeSlot();
        if (slot != null) {
            slot.setAvailable(true);
            timeSlotRepository.save(slot);
        }

        appointmentRepository.save(appointment);
    }

    @Transactional
    public void patientRescheduleAppointment(
            Long appointmentId,
            LocalDate newDate,
            LocalTime newTime,
            long doctorId,
            HttpServletRequest request
    ) {
        Patient patient = patientService.getCurrentPatient(request);

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        if (appointment.getPatient().getId() != patient.getId()) {
            throw new SecurityException("Unauthorized to reschedule this appointment.");
        }

        TimeSlot oldSlot = appointment.getTimeSlot();
        if (oldSlot != null) {
            oldSlot.setAvailable(true);
            timeSlotRepository.save(oldSlot);
        }

        TimeSlot newSlot = timeSlotRepository.findByStartTimeAndDoctorsId(newTime, doctorId)
                .orElseThrow(() -> new IllegalArgumentException("Time slot not available"));

        if (!newSlot.isAvailable()) {
            throw new IllegalArgumentException("This time slot is already booked.");
        }

        newSlot.setAvailable(false);
        appointment.setTimeSlot(newSlot);
        appointment.setTime(newSlot.getStartTime());
        appointment.setDate(newDate);
        appointment.setStatus(Status.RESCHEDULED);

        timeSlotRepository.save(newSlot);
        appointmentRepository.save(appointment);
    }

    public List<AppointmentDto> getAllAppointmentsForPatient (HttpServletRequest request){
        Patient patient = patientService.getCurrentPatient(request);

        List<AppointmentDto> appointments = appointmentRepository.findByPatient(patient)
                .stream()
                .map(appointmentMapper::toAppointmentDto)
                .collect(Collectors.toList());
        if (appointments.isEmpty()) {
            throw new IllegalArgumentException("No appointments found!");
        }
        return appointments;

    }

    public List<AppointmentDto> getBookedAppointmentsForPatient (HttpServletRequest request){
        Patient patient = patientService.getCurrentPatient(request);
        List<AppointmentDto> appointments = appointmentRepository.findByPatient(patient)
                .stream()
                .map(appointmentMapper::toAppointmentDto)
                .toList();

        if (appointments.isEmpty()) {
            throw new IllegalArgumentException("No appointments found!");
        }
        return appointments
                .stream()
                .filter(booked -> booked.status() == Status.BOOKED)
                .toList();
    }

    public List<AppointmentDto> getCanceledAppointmentsForPatient (HttpServletRequest request){
        Patient patient = patientService.getCurrentPatient(request);
        List<AppointmentDto> appointments = appointmentRepository.findByPatient(patient)
                .stream()
                .map(appointmentMapper::toAppointmentDto)
                .toList();
        if (appointments.isEmpty()) {
            throw new IllegalArgumentException("No appointments found!");
        }
        return appointments
                .stream()
                .filter(canceled -> canceled.status() == Status.CANCELED)
                .toList();
    }

    public List<AppointmentDto> getRescheduledAppointmentsForPatient (HttpServletRequest request){
        Patient patient = patientService.getCurrentPatient(request);
        List<AppointmentDto> appointments = appointmentRepository.findByPatient(patient)
                .stream()
                .map(appointmentMapper::toAppointmentDto)
                .toList();

        if (appointments.isEmpty()) {
            throw new IllegalArgumentException("No appointments found!");
        }
        return appointments
                .stream()
                .filter(rescheduled -> rescheduled.status() == Status.RESCHEDULED)
                .toList();
    }


    //For doctors
    public void doctorCancelAppointment(Long appointmentId, HttpServletRequest request) {
        Doctor doctor = doctorService.getCurrentDoctor(request);

        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new IllegalArgumentException("Appointment not found"));

        if (appointment.getDoctor().getId() != (doctor.getId())) {
            throw new SecurityException("Unauthorized to cancel this appointment.");
        }

        appointment.setStatus(Status.CANCELED);

        TimeSlot slot = appointment.getTimeSlot();
        if (slot != null) {
            slot.setAvailable(true);
            timeSlotRepository.save(slot);
        }

        appointmentRepository.save(appointment);
    }

    public List<AppointmentDto> getAllAppointmentsForDoctor (HttpServletRequest request){
        Doctor doctor = doctorService.getCurrentDoctor(request);

        if (appointmentRepository.findByDoctor(doctor).isEmpty()) {
            throw new IllegalArgumentException("No appointments found!");
        }
        else {
            return appointmentRepository.findByDoctor(doctor)
                    .stream()
                    .map(appointmentMapper::toAppointmentDto)
                    .collect(Collectors.toList());
        }
    }
}
