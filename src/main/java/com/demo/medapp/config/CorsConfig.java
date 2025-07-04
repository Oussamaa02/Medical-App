package com.demo.medapp.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Allow your Next.js origin
        config.addAllowedOrigin("http://localhost:3000");

        // Allow credentials (cookies, authorization headers)
        config.setAllowCredentials(true);

        // Allow all headers
        config.addAllowedHeader("*");

        // Allow all methods (GET, POST, etc.)
        config.addAllowedMethod("*");

        // Expose headers if needed
        config.addExposedHeader("Authorization");

        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}