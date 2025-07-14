package com.demo.medapp.config;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import static com.demo.medapp.enums.Permission.*;
import static com.demo.medapp.enums.Role.*;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfiguration {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;
    private final LogoutHandler logoutHandler;
    private static final String[] WHITELIST_URLS = {
            "/auth/**",
            "/v2/api-docs",
            "/v3/api-docs",
            "/v3/api-docs/**",
            "/swagger-resources",
            "/swagger-resources/**",
            "/configuration/ui",
            "/configuration/security",
            "/swagger-ui/**",
            "/webjars/**",
            "/swagger-ui.html"
    };


    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers(WHITELIST_URLS).permitAll()
                        // Admin endpoints
                        .requestMatchers("/admin/**").hasRole(ADMIN.name())
                        .requestMatchers(HttpMethod.GET, "/admin/**").hasAuthority(ADMIN_READ.getPermission())
                        .requestMatchers(HttpMethod.POST, "/admin/validate").hasAuthority(ADMIN_CREATE.getPermission())
                        .requestMatchers(HttpMethod.POST, "/admin/create-user").hasAuthority(ADMIN_CREATE.getPermission())
                        .requestMatchers(HttpMethod.PUT, "/admin/**").hasAuthority(ADMIN_UPDATE.getPermission())
                        .requestMatchers(HttpMethod.DELETE, "/admin/**").hasAuthority(ADMIN_DELETE.getPermission())

                        // Doctor endpoints
                        .requestMatchers("/doctor/**").hasRole( DOCTOR.name())
                        .requestMatchers(HttpMethod.GET, "/doctor/**").hasAnyAuthority( DOCTOR_READ.getPermission())
                        .requestMatchers(HttpMethod.PUT, "/doctor/profile").hasAnyAuthority(DOCTOR_UPDATE.getPermission())
                        .requestMatchers(HttpMethod.DELETE, "/doctor/profile").hasAnyAuthority( DOCTOR_DELETE.getPermission())

                        // Patient endpoints
                        .requestMatchers("/patient/**").hasRole(PATIENT.name())
                        .requestMatchers(HttpMethod.GET, "/patient/profile").hasAnyAuthority(PATIENT_READ.getPermission())
                        .requestMatchers(HttpMethod.PUT, "/patient/profile").hasAnyAuthority(PATIENT_UPDATE.getPermission())
                        .requestMatchers(HttpMethod.DELETE, "/patient/profile").hasAnyAuthority( PATIENT_DELETE.getPermission())
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class)
                .logout(logout -> logout
                        .logoutUrl("/auth/logout")
                        .addLogoutHandler(logoutHandler)
                        .logoutSuccessHandler(
                                (request, response, authentication) ->
                                {
                                    SecurityContextHolder.clearContext();
                                    response.setStatus(HttpServletResponse.SC_OK);
                                }
                        )
                )
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

        ;

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(List.of("*"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(List.of("Set-Cookie"));

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
