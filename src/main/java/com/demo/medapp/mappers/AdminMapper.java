package com.demo.medapp.mappers;

import com.demo.medapp.dtos.PatientResponseDto;
import com.demo.medapp.dtos.requests.AdminRequest;
import com.demo.medapp.models.Patient;
import com.demo.medapp.models.User;
import org.springframework.stereotype.Service;

@Service
public class AdminMapper {
    public AdminRequest toAdminResponseDto(User user){
        return new AdminRequest(
                user.getEmail(),
                user.getPassword()
        );
    }

}
