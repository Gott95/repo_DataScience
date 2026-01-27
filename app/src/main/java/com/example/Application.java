package com.example; // Asegúrate que coincida con tu paquete real

import com.vaadin.flow.component.page.AppShellConfigurator;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Bean;
import org.springframework.context.event.EventListener;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

import java.awt.Desktop;
import java.awt.GraphicsEnvironment; // Usamos el estándar de Java
import java.net.URI;

@SpringBootApplication
public class Application implements AppShellConfigurator {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

    // --- 1. LÓGICA DE NAVEGADOR (INTELIGENTE) ---
    @EventListener(ApplicationReadyEvent.class)
    public void launchBrowser() {
        // 🛡️ PROTECCIÓN DOCKER:
        // Si detectamos que no hay pantalla (Headless), como en Google Cloud, salimos.
        if (GraphicsEnvironment.isHeadless()) {
            System.out.println("--- 🐳 DOCKER/SERVIDOR DETECTADO: Navegador automático desactivado ---");
            return;
        }

        // Lógica solo para tu computadora local (Windows/Mac)
        if (System.getProperty("browser.opened") == null) {
            System.setProperty("browser.opened", "true");
            try {
                String urlEnv = System.getenv("VITE_API_URL");
                // Si no hay variable, asumimos localhost 8080
                String url = (urlEnv != null) ? urlEnv : "http://localhost:8080";

                if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                    Desktop.getDesktop().browse(new URI(url));
                }
            } catch (Exception e) {
                System.out.println("⚠ No se pudo abrir el navegador, pero la app sigue corriendo.");
            }
        }
    }

    // --- 2. FILTRO CORS GLOBAL (LA CLAVE DEL ÉXITO) ---
    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();

        // Configuración permisiva para que el Frontend (React) pueda hablar con el Backend
        config.setAllowCredentials(true);
        config.addAllowedOriginPattern("*"); // Acepta cualquier IP
        config.addAllowedHeader("*");
        config.addAllowedMethod("*");

        source.registerCorsConfiguration("/**", config);
        System.out.println("--- 🚀 FILTRO CORS GLOBAL ACTIVADO ---");
        return new CorsFilter(source);
    }
}
        