package com.demo.medapp.auth;

import com.demo.medapp.enums.Role;
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

}