package com.demo.medapp.mappers;

import com.demo.medapp.auth.RegisterRequestDoctor;
import org.springframework.stereotype.Service;
import com.demo.medapp.models.Location;

@Service
public class LocationMapper {
    public Location toLocation(RegisterRequestDoctor info){
        return new Location(
                info.getCity(),
                info.getAddress(),
                info.getZipCode()
        );
    }
}
