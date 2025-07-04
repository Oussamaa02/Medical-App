package com.demo.medapp.services;

import com.demo.medapp.repos.TokenRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class LogoutService implements LogoutHandler {
    private final TokenRepository tokenRepository;
    private static final String JWT_COOKIE_NAME = "jwt";

    @Override
    public void logout(
            HttpServletRequest request,
            HttpServletResponse response,
            Authentication authentication
    ) {
        // Try to get token from cookie first
        Optional<String> jwt = getCookieValue(request, JWT_COOKIE_NAME);

        // Fallback to Authorization header if needed
        if (jwt.isEmpty()) {
            final String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                jwt = Optional.of(authHeader.substring(7));
            }
        }

        // Revoke the token if found
        jwt.ifPresent(token -> {
            var storedToken = tokenRepository.findByToken(token)
                    .orElse(null);
            if (storedToken != null) {
                storedToken.setExpired(true);
                storedToken.setRevoked(true);
                tokenRepository.save(storedToken);
            }
        });

        // Clear the authentication cookie
        clearAuthCookie(response);
    }

    private Optional<String> getCookieValue(HttpServletRequest request, String name) {
        if (request.getCookies() == null) {
            return Optional.empty();
        }
        return Arrays.stream(request.getCookies())
                .filter(cookie -> name.equals(cookie.getName()))
                .map(Cookie::getValue)
                .findFirst();
    }

    private void clearAuthCookie(HttpServletResponse response) {
        ResponseCookie cookie = ResponseCookie.from(JWT_COOKIE_NAME, "")
                .httpOnly(true)
                .path("/")
                .maxAge(0) // Immediately expire the cookie
                .build();
        response.addHeader("Set-Cookie", cookie.toString());
    }
}