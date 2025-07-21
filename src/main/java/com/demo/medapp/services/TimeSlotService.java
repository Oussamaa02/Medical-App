package com.demo.medapp.services;

import com.demo.medapp.dtos.TimeSlotDto;
import com.demo.medapp.enums.Status;
import com.demo.medapp.mappers.DoctorMapper;
import com.demo.medapp.mappers.TimeSlotMapper;
import com.demo.medapp.models.Appointment;
import com.demo.medapp.models.Doctor;
import com.demo.medapp.models.TimeSlot;
import com.demo.medapp.repos.AppointmentRepository;
import com.demo.medapp.repos.DoctorRepository;
import com.demo.medapp.repos.TimeSlotRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TimeSlotService {
    private final DoctorRepository doctorRepository;
    private final AppointmentRepository appointmentRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final TimeSlotMapper timeSlotMapper;
    private final DoctorService doctorService;


    public List<TimeSlot> listAvailableTimeSlots(LocalDate date, Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();
        List<TimeSlot> allSlots = timeSlotRepository.findByDoctorId(doctorId);
        List<Appointment> booked = appointmentRepository.findByDoctorAndDate(doctor, date)
                .stream().filter(appointment -> appointment.getStatus().equals(Status.BOOKED) || appointment.getStatus().equals(Status.RESCHEDULED) )
                .toList();

        return allSlots;
    }

    public List<TimeSlotDto> getAvailableTimeSlots(LocalDate date, Long doctorId) {
        Doctor doctor = doctorRepository.findById(doctorId).orElseThrow();
        List<TimeSlot> allSlots = timeSlotRepository.findByDoctorId(doctorId);
        List<Appointment> booked = appointmentRepository.findByDoctorAndDate(doctor, date)
                .stream().filter(appointment -> appointment.getStatus().equals(Status.BOOKED) || appointment.getStatus().equals(Status.RESCHEDULED) )
                .toList();

        return allSlots.stream()
                .filter(slot -> booked.stream().noneMatch(a -> a.getTime().equals(slot.getStartTime())))
                .map(timeSlotMapper::toTimeSlotDto)
                .toList();
    }

    public List<TimeSlotDto> getAllTimeSlotsForDoctor (HttpServletRequest request){
        Doctor doctor = doctorService.getCurrentDoctor(request);

        if (timeSlotRepository.findByDoctorId(doctor.getId()).isEmpty()) {
            return Collections.emptyList();
        }
        else {
            return timeSlotRepository.findByDoctorId(doctor.getId())
                    .stream()
                    .map(timeSlotMapper::toTimeSlotDto)
                    .collect(Collectors.toList());
        }
    }

    @Transactional
    public void addTimeSlot(LocalTime startTime, HttpServletRequest request) {
        Doctor doctor = doctorService.getCurrentDoctor(request);
        Optional<TimeSlot> existingSlotOpt = timeSlotRepository
                .findByStartTime(startTime);

        TimeSlot timeSlot;

        if (existingSlotOpt.isPresent()) {
            timeSlot = existingSlotOpt.get();

            if (!timeSlot.getDoctors().contains(doctor)) {
                timeSlot.getDoctors().add(doctor);
            }
            else{
                throw new IllegalArgumentException("Time slot already exists!");
            }

        } else {
            timeSlot = TimeSlot.builder()
                    .startTime(startTime)
                    .doctors(Collections.singletonList(doctor))
                    .appointments(new ArrayList<>())
                    .build();
        }

        timeSlotRepository.save(timeSlot);
    }

    @Transactional
    public void deleteTimeSlot(LocalTime startTime, HttpServletRequest request) {
        Doctor doctor = doctorService.getCurrentDoctor(request);

        Optional<TimeSlot> optionalSlot = timeSlotRepository.findByStartTime(startTime);
        if (optionalSlot.isEmpty()) {
            throw new IllegalArgumentException("Time slot not found.");
        }

        TimeSlot slot = optionalSlot.get();

        slot.getDoctors().remove(doctor);
        doctor.getTimeSlots().remove(slot);

        if (slot.getDoctors().isEmpty()) {
            timeSlotRepository.delete(slot);
        } else {
            timeSlotRepository.save(slot);
        }
    }
}
