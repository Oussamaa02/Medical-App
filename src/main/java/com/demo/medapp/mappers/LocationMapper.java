package com.demo.medapp.mappers;

import com.demo.medapp.auth.RegisterRequestDoctor;
import com.demo.medapp.dtos.LocationDto;
import org.springframework.stereotype.Service;
import com.demo.medapp.models.Location;

@Service
public class LocationMapper {
    public Location toRegisterLocation (RegisterRequestDoctor info){
        return new Location(
                info.getCity(),
                info.getAddress(),
                info.getZipCode()
        );
    }

    public LocationDto toLocationResponseDto (Location location){
        return new LocationDto(
                location.getCity(),
                location.getAddress(),
                location.getZipCode()
        );
    }

}
