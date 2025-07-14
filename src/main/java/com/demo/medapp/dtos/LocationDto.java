package com.demo.medapp.dtos;

public record LocationDto(
        String city,
        String address,
        String zipCode
) {
}
