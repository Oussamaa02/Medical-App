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

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth

                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/admin/**").hasAnyRole(ADMIN.name(),DOCTOR.name(),PATIENT.name())
                        .requestMatchers(HttpMethod.GET, "/admin/**").hasAnyAuthority(ADMIN_READ.name(), DOCTOR_READ.name())
                        .requestMatchers(HttpMethod.POST, "/admin/**").hasAnyAuthority(ADMIN_CREATE.name(), DOCTOR_CREATE.name())
                        .requestMatchers(HttpMethod.PUT, "/admin/**").hasAnyAuthority(ADMIN_UPDATE.name(), DOCTOR_UPDATE.name())
                        .requestMatchers(HttpMethod.DELETE, "/admin/**").hasAnyAuthority(ADMIN_DELETE.name(), DOCTOR_DELETE.name())

                        .requestMatchers("/doctor/**").hasRole(DOCTOR.name())
                        .requestMatchers(HttpMethod.GET, "/doctor/**").hasAuthority(DOCTOR_READ.name())
                        .requestMatchers(HttpMethod.POST, "/doctor/**").hasAuthority(DOCTOR_CREATE.name())
                        .requestMatchers(HttpMethod.PUT, "/doctor/**").hasAuthority(DOCTOR_UPDATE.name())
                        .requestMatchers(HttpMethod.DELETE, "/doctor/**").hasAuthority(DOCTOR_DELETE.name())

                        .requestMatchers("/patient/**").hasRole(PATIENT.name())
                        .requestMatchers(HttpMethod.GET, "/patient/**").hasAuthority(PATIENT_READ.name())
                        .requestMatchers(HttpMethod.POST, "/patient/**").hasAuthority(PATIENT_CREATE.name())
                        .requestMatchers(HttpMethod.PUT, "/patient/**").hasAuthority(PATIENT_UPDATE.name())
                        .requestMatchers(HttpMethod.DELETE, "/patient/**").hasAuthority(PATIENT_DELETE.name())

                        .requestMatchers(
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
                        ).permitAll()

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
