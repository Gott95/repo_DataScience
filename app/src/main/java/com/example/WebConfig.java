package com.example;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Aplica a todas las URLs de la API
                .allowedOrigins("*") // ¡Permite CUALQUIER IP! (Vital para que funcione tu IP pública)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Permite todos los verbos HTTP
                .allowedHeaders("*"); // Permite todos los encabezados
    }
}