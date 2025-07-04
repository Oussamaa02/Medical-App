package com.demo.medapp.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class TimeSlot {
    @Id
    @GeneratedValue
    private Long id;

    private LocalDate date;

    private LocalTime startTime;

    private LocalTime endTime;

    private boolean isAvailable;

    @OneToMany(mappedBy = "timeSlot")
    private List<Appointment> appointments;
}
