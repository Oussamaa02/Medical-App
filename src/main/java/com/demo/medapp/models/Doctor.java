package com.demo.medapp.models;

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

    @Embedded
    private Location location;

    @OneToMany(mappedBy = "doctor")
    private List<Appointment> appointments;
}
