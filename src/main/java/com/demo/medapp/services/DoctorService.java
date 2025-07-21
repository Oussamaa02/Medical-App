package com.demo.medapp.services;

import com.demo.medapp.dtos.requests.RegisterRequestDoctor;
import com.demo.medapp.dtos.requests.RegisterRequestPatient;
import com.demo.medapp.mappers.LocationMapper;
import com.demo.medapp.models.Doctor;
import com.demo.medapp.models.Location;
import com.demo.medapp.models.Patient;
import com.demo.medapp.repos.DoctorRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class DoctorService {

    private final JwtService jwtService;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final LocationMapper locationMapper;

    public Doctor getCurrentDoctor(HttpServletRequest request){
        if (request.getCookies() == null) {
            throw new IllegalArgumentException("Unauthorized doctor!");
        }

        Optional<String> jwtOpt = Arrays.stream(request.getCookies())
                .filter(c -> "jwt".equals(c.getName()))
                .map(Cookie::getValue)
                .findFirst();

        if (jwtOpt.isEmpty()) {
            throw new IllegalArgumentException("Unauthorized doctor!");
        }

        String jwt = jwtOpt.get();
        String email = jwtService.extractUsername(jwt);
        Doctor doctor = doctorRepository.findByEmail(email).orElse(null);

        if (doctor == null || !jwtService.isTokenValid(jwt, doctor)) {
            throw new IllegalArgumentException("Unauthorized doctor!");
        }
        return doctor;
    }

    public void editProfile(RegisterRequestDoctor request, HttpServletRequest httpServletRequest) {
        Doctor doctor = getCurrentDoctor(httpServletRequest);

        Location existingLocation = doctor.getLocation();
        if (existingLocation == null) {
            existingLocation = new Location();
            doctor.setLocation(existingLocation);
        }

        if (request.getFirstName() != null && !request.getFirstName().trim().isEmpty()) {
            doctor.setFirstName(request.getFirstName());
        }

        if (request.getLastName() != null && !request.getLastName().trim().isEmpty()) {
            doctor.setLastName(request.getLastName());
        }

        if (request.getEmail() != null && !request.getEmail().trim().isEmpty() && !request.getEmail().equals(doctor.getEmail())) {
            if (doctorRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new IllegalArgumentException("Email is already in use");
            }
            doctor.setEmail(request.getEmail());
        }

        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            String encodedPassword = passwordEncoder.encode(request.getPassword());
            doctor.setPassword(encodedPassword);
        }

        if (request.getPhoneNumber() != null && !request.getPhoneNumber().trim().isEmpty()) {
            doctor.setPhoneNumber(request.getPhoneNumber());
        }

        if (request.getLicenseNumber() != null && !request.getLicenseNumber().trim().isEmpty()) {
            doctor.setLicenseNumber(request.getLicenseNumber());
        }

        if (request.getSpeciality() != null && !request.getSpeciality().trim().isEmpty()) {
            doctor.setSpeciality(request.getSpeciality());
        }

        if (request.getAddress() != null && !request.getAddress().trim().isEmpty()) {
            existingLocation.setAddress(request.getAddress());
        }

        if (request.getCity() != null && !request.getCity().trim().isEmpty()) {
            existingLocation.setCity(request.getCity());
        }

        if (request.getZipCode() != null && !request.getZipCode().trim().isEmpty()) {
            existingLocation.setZipCode(request.getZipCode());
        }

        doctorRepository.save(doctor);
    }
}
