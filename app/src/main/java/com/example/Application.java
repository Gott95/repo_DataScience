package com.example;

import com.vaadin.flow.theme.lumo.Lumo;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import com.vaadin.flow.component.dependency.StyleSheet;
import com.vaadin.flow.component.page.AppShellConfigurator;

import java.awt.Desktop;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URI;
import java.io.BufferedReader;
import java.util.concurrent.Executors;

@SpringBootApplication
@StyleSheet(Lumo.STYLESHEET)
@StyleSheet(Lumo.UTILITY_STYLESHEET)
@StyleSheet("styles.css")
public class Application implements AppShellConfigurator {

    private static Process pythonProcess;

    public static void main(String[] args) {
        // Intento de limpieza al cerrar (funciona si cierras con Ctrl+C en terminal, a veces falla con el botón Stop)
        Runtime.getRuntime().addShutdownHook(new Thread(() -> {
            if (pythonProcess != null && pythonProcess.isAlive()) {
                System.out.println("Cerrando servicio Python...");
                pythonProcess.descendants().forEach(ProcessHandle::destroyForcibly);
                pythonProcess.destroyForcibly();
            }
        }));
        SpringApplication.run(Application.class, args);
    }

    @Bean
    public CommandLineRunner runPythonService() {
        return args -> {
            // PASO 1: LIMPIEZA PREVENTIVA
            // Antes de iniciar, matamos cualquier cosa que esté en el puerto 8000
            killProcessOnPort8000();

            // PASO 2: INICIAR SERVICIO
            Executors.newSingleThreadExecutor().submit(() -> {
                try {
                    ProcessBuilder processBuilder = new ProcessBuilder();
                    String pythonExecutableName = "python";
                    String scriptName = "app.py"; 

                    File userDir = new File(System.getProperty("user.dir"));
                    File projectRoot = userDir.getName().endsWith("app") ? userDir.getParentFile() : userDir;
                    File pythonServiceDir = new File(projectRoot, "churn-service");
                    processBuilder.directory(pythonServiceDir);
                    
                    // RECOMENDACIÓN: Intentar ejecutar directo sin cmd.exe para tener mejor control del PID
                    if (System.getProperty("os.name").toLowerCase().contains("win")) {
                        // Probamos ejecutar python directo. Si falla, vuelve a poner "cmd.exe", "/c"...
                        processBuilder.command(pythonExecutableName, scriptName);
                    } else {
                        processBuilder.command(pythonExecutableName, scriptName);
                    }
                    
                    processBuilder.redirectErrorStream(true);
                    
                    System.out.println("Iniciando servicio Python en: " + pythonServiceDir);
                    pythonProcess = processBuilder.start();
                    
                    // Leer logs en tiempo real
                    new Thread(() -> {
                        try (var reader = new BufferedReader(new InputStreamReader(pythonProcess.getInputStream()))) {
                            String line;
                            while ((line = reader.readLine()) != null) {
                                System.out.println("Python: " + line);
                            }
                        } catch (IOException e) { }
                    }).start();

                    int exitCode = pythonProcess.waitFor();
                    System.out.println("Python service exited with code: " + exitCode);
                    
                } catch (Exception e) {
                    e.printStackTrace();
                }
            });
        };
    }

    // --- NUEVO MÉTODO MÁGICO PARA WINDOWS ---
    private void killProcessOnPort8000() {
        if (!System.getProperty("os.name").toLowerCase().contains("win")) return;

        System.out.println("Verificando si el puerto 8000 está libre...");
        try {
            // 1. Ejecutar netstat para buscar el PID
            Process netstat = new ProcessBuilder("cmd.exe", "/c", "netstat -ano | findstr :8000").start();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(netstat.getInputStream()))) {
                String line = reader.readLine();
                if (line != null && !line.trim().isEmpty()) {
                    // La línea se ve así: "TCP 0.0.0.0:8000 0.0.0.0:0 LISTENING 12345"
                    // El PID es el último número.
                    String[] parts = line.trim().split("\\s+");
                    String pid = parts[parts.length - 1];
                    
                    System.out.println("Puerto 8000 ocupado por PID: " + pid + ". Matándolo ahora...");
                    
                    // 2. Ejecutar taskkill
                    new ProcessBuilder("taskkill", "/F", "/PID", pid).start().waitFor();
                    System.out.println("Proceso fantasma eliminado. El puerto está libre.");
                }
            }
        } catch (Exception e) {
            System.err.println("No se pudo limpiar el puerto automáticamente: " + e.getMessage());
        }
    }

    // Tu método del navegador (mantenlo igual)
    @EventListener(ApplicationReadyEvent.class)
    public void launchBrowser() {
         System.setProperty("java.awt.headless", "false"); 
         // ... (Pega aquí tu código del navegador corregido que te di antes)
         try {
             String url = "http://localhost:8080";
             if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                 Desktop.getDesktop().browse(new URI(url));
             } else {
                 new ProcessBuilder("rundll32", "url.dll,FileProtocolHandler", url).start();
             }
         } catch (Exception e) { e.printStackTrace(); }
    }
}