package com.demo.medapp.models;

import com.demo.medapp.enums.Status;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Appointment {

    @Id
    @GeneratedValue
    private Long id;

    private LocalDate date;

    private LocalTime time;

    private Status status;

    @ManyToOne
    @JoinColumn (name = "doctor_id")
    private Doctor doctor;

    @ManyToOne
    @JoinColumn (name="patient_id")
    private Patient patient;

    @OneToOne (mappedBy = "appointment")
    private Form form;

    @ManyToOne
    @JoinColumn(name = "time_slot_id")
    private TimeSlot timeSlot;
}
