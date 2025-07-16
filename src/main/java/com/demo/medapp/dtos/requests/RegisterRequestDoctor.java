package com.demo.medapp.dtos.requests;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterRequestDoctor {
    private String firstName;
    private String lastName;
    private String speciality;
    private String licenseNumber;
    private String phoneNumber;
    private String email;
    private String password;
    private String city;
    private String address;
    private String ZipCode;
}