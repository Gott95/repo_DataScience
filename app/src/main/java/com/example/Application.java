package com.example; // Asegúrate que coincida con tu paquete real

import com.vaadin.flow.component.page.AppShellConfigurator;
import com.vaadin.flow.theme.Theme;
import com.vaadin.flow.theme.lumo.Lumo;
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






// package com.example;

// import com.vaadin.flow.theme.lumo.Lumo;
// import org.springframework.boot.SpringApplication;
// import org.springframework.boot.autoconfigure.SpringBootApplication;
// import org.springframework.context.annotation.Bean;
// import org.springframework.boot.CommandLineRunner;
// import org.springframework.boot.context.event.ApplicationReadyEvent;
// import org.springframework.context.event.EventListener;

// import org.springframework.context.annotation.Bean;
// import org.springframework.web.cors.CorsConfiguration;
// import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
// import org.springframework.web.filter.CorsFilter;

// import com.dukescript.spi.canvas.GraphicsEnvironment;
// import com.vaadin.flow.component.dependency.StyleSheet;
// import com.vaadin.flow.component.page.AppShellConfigurator;

// import java.awt.Desktop;
// import java.io.File;
// import java.io.IOException;
// import java.io.InputStreamReader;
// import java.net.URI;
// import java.io.BufferedReader;
// import java.util.concurrent.Executors;

// @SpringBootApplication
// @StyleSheet(Lumo.STYLESHEET)
// @StyleSheet(Lumo.UTILITY_STYLESHEET)
// @StyleSheet("styles.css")
// public class Application implements AppShellConfigurator {

//     private static Process pythonProcess;

//     public static void main(String[] args) {
//         Runtime.getRuntime().addShutdownHook(new Thread(() -> {
//             if (pythonProcess != null && pythonProcess.isAlive()) {
//                 System.out.println("Cerrando servicio Python...");
//                 pythonProcess.descendants().forEach(ProcessHandle::destroyForcibly);
//                 pythonProcess.destroyForcibly();
//             }
//         }));
//         SpringApplication.run(Application.class, args);
//     }

//     @Bean
//     public CommandLineRunner runPythonService() {
//         return args -> {
//             killProcessOnPort8000();
//             Executors.newSingleThreadExecutor().submit(() -> {
//                 try {
//                     ProcessBuilder processBuilder = new ProcessBuilder();
//                     String pythonExecutableName = "python";
//                     String scriptName = "app.py";

//                     File userDir = new File(System.getProperty("user.dir"));
//                     File projectRoot = userDir.getName().endsWith("app") ? userDir.getParentFile() : userDir;
//                     File pythonServiceDir = new File(projectRoot, "churn-service");
//                     processBuilder.directory(pythonServiceDir);

//                     if (System.getProperty("os.name").toLowerCase().contains("win")) {
//                         processBuilder.command(pythonExecutableName, scriptName);
//                     } else {
//                         processBuilder.command(pythonExecutableName, scriptName);
//                     }

//                     processBuilder.redirectErrorStream(true);

//                     System.out.println("Iniciando servicio Python en: " + pythonServiceDir);
//                     pythonProcess = processBuilder.start();

//                     new Thread(() -> {
//                         try (var reader = new BufferedReader(new InputStreamReader(pythonProcess.getInputStream()))) {
//                             String line;
//                             while ((line = reader.readLine()) != null) {
//                                 System.out.println("Python: " + line);
//                             }
//                         } catch (IOException e) {
//                         }
//                     }).start();

//                     int exitCode = pythonProcess.waitFor();
//                     System.out.println("Python service exited with code: " + exitCode);

//                 } catch (Exception e) {
//                     e.printStackTrace();
//                 }
//             });
//         };
//     }

//     private void killProcessOnPort8000() {
//         if (!System.getProperty("os.name").toLowerCase().contains("win"))
//             return;

//         System.out.println("Verificando si el puerto 8000 está libre...");
//         try {
//             Process netstat = new ProcessBuilder("cmd.exe", "/c", "netstat -ano | findstr :8000").start();
//             try (BufferedReader reader = new BufferedReader(new InputStreamReader(netstat.getInputStream()))) {
//                 String line = reader.readLine();
//                 if (line != null && !line.trim().isEmpty()) {
//                     String[] parts = line.trim().split("\\s+");
//                     String pid = parts[parts.length - 1];

//                     System.out.println("Puerto 8000 ocupado por PID: " + pid + ". Matándolo ahora...");
//                     new ProcessBuilder("taskkill", "/F", "/PID", pid).start().waitFor();
//                     System.out.println("Proceso fantasma eliminado. El puerto está libre.");
//                 }
//             }
//         } catch (Exception e) {
//             System.err.println("No se pudo limpiar el puerto automáticamente: " + e.getMessage());
//         }
//     }

// @EventListener(ApplicationReadyEvent.class)
//     public void launchBrowser() {
//         // 🛡️ PROTECCIÓN DOCKER:
//         // Si detectamos que no hay pantalla (Headless), salimos inmediatamente.
//         // Esto evita que Docker intente abrir Chrome y explote.
//         if (GraphicsEnvironment.isHeadless()) {
//             System.out.println("--- 🐳 DOCKER/SERVIDOR DETECTADO: Navegador automático desactivado ---");
//             return;
//         }

//         // Lógica solo para tu computadora local (Windows/Mac)
//         if (System.getProperty("browser.opened") == null) {
//             System.setProperty("browser.opened", "true");
//             try {
//                 // Usamos localhost por defecto si no hay variable, para evitar nulos
//                 String urlEnv = System.getenv("VITE_API_URL");
//                 String url = (urlEnv != null) ? urlEnv : "http://localhost:8080";

//                 if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
//                     Desktop.getDesktop().browse(new URI(url));
//                 }
//             } catch (Exception e) {
//                 // Silenciamos errores en local
//                 System.out.println("⚠ No se pudo abrir el navegador, pero la app sigue corriendo.");
//             }
//         }
//     }

//     @Bean
//     public CorsFilter corsFilter() {
//         UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
//         CorsConfiguration config = new CorsConfiguration();

//         // Permitir credenciales y orígenes
//         config.setAllowCredentials(true);
//         config.addAllowedOriginPattern("*"); // Usa Pattern para aceptar cualquier IP
//         config.addAllowedHeader("*");
//         config.addAllowedMethod("*");

//         source.registerCorsConfiguration("/**", config);
//         System.out.println("--- 🚀 FILTRO CORS ACTIVADO DESDE MAIN 🚀 ---");
//         return new CorsFilter(source);
//     }

// }