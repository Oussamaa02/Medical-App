package com.demo.medapp.auth;

import lombok.*;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor

public class AuthenticationResponse {
    private String accessToken;
    private String refreshToken;
}
