package com.demo.medapp.models;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@Builder
public class TimeSlot {
    @Id
    @GeneratedValue
    private Long id;

    private LocalTime startTime;

    private boolean isAvailable;

    @OneToMany(mappedBy = "timeSlot")
    private List<Appointment> appointments;

    @ManyToMany
    @JoinTable(
        name = "doctor-timeslot",
        joinColumns = @JoinColumn(name = "timeSlot_id"),
        inverseJoinColumns = @JoinColumn(name = "doctor_id")

    )
    private List<Doctor> doctors;
}
