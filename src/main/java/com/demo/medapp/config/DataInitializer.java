package com.demo.medapp.config;

import com.demo.medapp.enums.Role;
import com.demo.medapp.models.User;
import com.demo.medapp.repos.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DataInitializer {
    @Bean
    CommandLineRunner init(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            String adminEmail = "admin@gmail.com";
            boolean adminExists = userRepository.findByEmail(adminEmail).isPresent();

            // Only insert if not already present
            if (!adminExists) {
                User admin = User.builder()
                        .email(adminEmail)
                        .password(passwordEncoder.encode("admin")) // Never store raw passwords
                        .role(Role.ADMIN)
                        .build();

                userRepository.save(admin);
                System.out.println("✅ Admin user created.");
            }
        };
    }

}
