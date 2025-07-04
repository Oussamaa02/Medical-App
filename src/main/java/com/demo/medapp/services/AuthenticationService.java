package com.demo.medapp.services;

import com.demo.medapp.auth.AuthenticationRequest;
import com.demo.medapp.auth.RegisterRequestDoctor;
import com.demo.medapp.auth.RegisterRequestPatient;
import com.demo.medapp.models.Doctor;
import com.demo.medapp.models.Patient;
import com.demo.medapp.token.Token;
import com.demo.medapp.repos.TokenRepository;
import com.demo.medapp.enums.TokenType;
import com.demo.medapp.enums.Role;
import com.demo.medapp.models.User;
import com.demo.medapp.repos.UserRepository;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final TokenRepository tokenRepository;
    private final UserRepository repository;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    private static final String JWT_COOKIE_NAME = "jwt";

    public void registerPatient(RegisterRequestPatient request, HttpServletResponse response) {
        var user = Patient.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .age(request.getAge())
                .gender(request.getGender())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.PATIENT)
                .build();

        var savedUser = repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        saveUserToken(savedUser, jwtToken);
        setAuthCookie(response, jwtToken);
    }

    public void registerDoctor(RegisterRequestDoctor request, HttpServletResponse response) {
        var user = Doctor.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .speciality(request.getSpeciality())
                .licenseNumber(request.getLicenseNumber())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.DOCTOR)
                .build();

        var savedUser = repository.save(user);
        var jwtToken = jwtService.generateToken(user);
        saveUserToken(savedUser, jwtToken);
        setAuthCookie(response, jwtToken);
    }


    public void authenticate(AuthenticationRequest request, HttpServletResponse response) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );
        var user = repository.findByEmail(request.getEmail())
                .orElseThrow();

        revokeAllUserTokens(user);

        var jwtToken = jwtService.generateToken(user);
        saveUserToken(user, jwtToken);

        // Set the JWT in an HTTP-only cookie instead of returning it in the body
        setAuthCookie(response, jwtToken);
    }

    // St the authentication cookie
    private void setAuthCookie(HttpServletResponse response, String jwtToken) {
        ResponseCookie cookie = ResponseCookie.from(JWT_COOKIE_NAME, jwtToken)
                .httpOnly(true)
                .secure(false)
                .path("/")
                .maxAge(24 * 60 * 60)
                .sameSite("Lax") // CSRF protection
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
    }

    // For logout
    public void clearAuthCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(JWT_COOKIE_NAME, "")
                .httpOnly(true)
                .path("/")
                .maxAge(0) // Immediately expire the cookie
                .sameSite("Lax")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());
        response.addHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.addHeader("Access-Control-Allow-Credentials", "true");
    }

    private void revokeAllUserTokens(User user) {
        var validTokens = tokenRepository.findAllValidTokenByUser(user.getId());
        if (validTokens.isEmpty())
            return;
        validTokens.forEach(t -> {
            t.setRevoked(true);
            t.setExpired(true);
        });
        tokenRepository.saveAll(validTokens);
    }

    private void saveUserToken(User user, String jwtToken) {
        var token = Token.builder()
                .user(user)
                .token(jwtToken)
                .tokenType(TokenType.BEARER)
                .revoked(false)
                .expired(false)
                .build();

        tokenRepository.save(token);
    }
}