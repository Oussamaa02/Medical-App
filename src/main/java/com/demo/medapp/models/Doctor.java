package com.demo.medapp.models;

import com.demo.medapp.tokens.VerificationToken;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Doctor extends User {

    private String firstName;
    private String lastName;
    private String speciality;
    private String licenseNumber;
    private String phoneNumber;
    @Column(nullable = false,  columnDefinition = "boolean default false")
    private boolean isValidated;

    @Embedded
    private Location location;

    @OneToMany(mappedBy = "doctor")
    private List<Appointment> appointments;

    @OneToOne(mappedBy = "doctor",cascade = CascadeType.ALL)
    private VerificationToken verificationToken;

    @ManyToMany(mappedBy = "doctors")
    private List<TimeSlot> timeSlots;
}
