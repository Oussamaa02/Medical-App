package com.demo.medapp.dtos;

public record PatientDto(
         String firstName,
         String lastName,
         String email,
         int age,
         String phoneNumber,
         String gender

) {
}
