package com.demo.medapp.models;

import jakarta.persistence.Embeddable;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Embeddable
@Builder
public class Location {
    private String city;
    private String address;
    private String zipCode;
    private Double latitude;
    private Double longitude;

    public Location(){}

    public Location(String city, String address, String zipCode, Double latitude, Double longitude){
        this.city = city;
        this.address = address;
        this.zipCode = zipCode;
        this.latitude = latitude;
        this.longitude = longitude;
    }

    public Location(String city, String address, String zipCode){
        this.city = city;
        this.address = address;
        this.zipCode = zipCode;
    }
}
