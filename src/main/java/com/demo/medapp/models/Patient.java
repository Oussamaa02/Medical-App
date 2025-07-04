package com.demo.medapp.models;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.List;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@SuperBuilder
public class Patient extends User {
    private String firstName;
    private String lastName;
    private int age;
    private String gender;
    private String phoneNumber;

    @OneToMany (mappedBy = "patient")
    private List<Appointment> appointments;


}
