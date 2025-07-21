package com.demo.medapp.models;

import com.demo.medapp.tokens.Token;
import com.demo.medapp.tokens.VerificationToken;
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
    @Column(nullable = false,  columnDefinition = "boolean default false")
    private boolean isValidated;


    @OneToMany (mappedBy = "patient")
    private List<Appointment> appointments;

    @OneToOne(mappedBy = "patient",cascade = CascadeType.ALL)
    private VerificationToken verificationToken;

}
