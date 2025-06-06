package com.foodie1.config;

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
        
        // Cho phép tất cả origins trong môi trường development
        config.addAllowedOrigin("http://localhost:5174");
        config.addAllowedOrigin("http://localhost:3000");
        
        // Cho phép tất cả headers
        config.addAllowedHeader("*");
        
        // Cho phép tất cả methods (GET, POST, PUT, DELETE, etc.)
        config.addAllowedMethod("*");
        
        // Cho phép gửi credentials (cookies, auth headers)
        config.setAllowCredentials(true);
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
} 