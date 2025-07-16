package com.demo.medapp.dtos;

public record PatientAdminResponseDto(
         String firstName,
         String lastName,
         String email,
         int age,
         String phoneNumber,
         String gender

) {
}
