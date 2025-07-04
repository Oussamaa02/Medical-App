package com.demo.medapp.auth;

import com.demo.medapp.enums.Role;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegisterRequestPatient {
    private String firstName;
    private String lastName;
    private String email;
    private String password;
    private int age;
    private String gender;
    private String phoneNumber;
}
