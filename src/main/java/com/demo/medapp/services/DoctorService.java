package com.demo.medapp.services;

import com.demo.medapp.enums.Status;
import com.demo.medapp.models.Appointment;
import com.demo.medapp.models.Doctor;
import com.demo.medapp.models.TimeSlot;
import com.demo.medapp.repos.AppointmentRepository;
import com.demo.medapp.repos.DoctorRepository;
import com.demo.medapp.repos.TimeSlotRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class DoctorService {
    private final TimeSlotRepository timeSlotRepository;
    private final AppointmentRepository appointmentRepository;
    private final JwtService jwtService;
    private final DoctorRepository doctorRepository;

    public Doctor getCurrentDoctor(HttpServletRequest request){
        if (request.getCookies() == null) {
            throw new IllegalArgumentException("Unauthorized doctor!");
        }

        Optional<String> jwtOpt = Arrays.stream(request.getCookies())
                .filter(c -> "jwt".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst();

        if (jwtOpt.isEmpty()) {
            throw new IllegalArgumentException("Unauthorized doctor!");
        }

        String jwt = jwtOpt.get();
        String email = jwtService.extractUsername(jwt);
        Doctor doctor = doctorRepository.findByEmail(email).orElse(null);

        if (doctor == null || !jwtService.isTokenValid(jwt, doctor)) {
            throw new IllegalArgumentException("Unauthorized doctor!");
        }
        return doctor;
    }

    @Transactional
    public void addTimeSlot(LocalTime startTime, HttpServletRequest request) {
        Doctor doctor = getCurrentDoctor(request);
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
                    .isAvailable(true)
                    .doctors(Collections.singletonList(doctor))
                    .appointments(new ArrayList<>())
                    .build();
        }

        timeSlotRepository.save(timeSlot);
    }

    @Transactional
    public void deleteTimeSlot(LocalTime startTime, HttpServletRequest request) {
        Doctor doctor = getCurrentDoctor(request);

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
