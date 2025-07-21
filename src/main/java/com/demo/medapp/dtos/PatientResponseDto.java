package com.demo.medapp.dtos;

public record PatientResponseDto(
         String firstName,
         String lastName,
         String email,
         int age,
         String phoneNumber,
         String gender

) {
}
