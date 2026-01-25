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
            killProcessOnPort8000();
            Executors.newSingleThreadExecutor().submit(() -> {
                try {
                    ProcessBuilder processBuilder = new ProcessBuilder();
                    String pythonExecutableName = "python";
                    String scriptName = "app.py"; 

                    File userDir = new File(System.getProperty("user.dir"));
                    File projectRoot = userDir.getName().endsWith("app") ? userDir.getParentFile() : userDir;
                    File pythonServiceDir = new File(projectRoot, "churn-service");
                    processBuilder.directory(pythonServiceDir);
                    
                    
                    if (System.getProperty("os.name").toLowerCase().contains("win")) {
                        processBuilder.command(pythonExecutableName, scriptName);
                    } else {
                        processBuilder.command(pythonExecutableName, scriptName);
                    }
                    
                    processBuilder.redirectErrorStream(true);
                    
                    System.out.println("Iniciando servicio Python en: " + pythonServiceDir);
                    pythonProcess = processBuilder.start();
                    
                    
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

    
    private void killProcessOnPort8000() {
        if (!System.getProperty("os.name").toLowerCase().contains("win")) return;

        System.out.println("Verificando si el puerto 8000 está libre...");
        try {
            Process netstat = new ProcessBuilder("cmd.exe", "/c", "netstat -ano | findstr :8000").start();
            try (BufferedReader reader = new BufferedReader(new InputStreamReader(netstat.getInputStream()))) {
                String line = reader.readLine();
                if (line != null && !line.trim().isEmpty()) {
                    String[] parts = line.trim().split("\\s+");
                    String pid = parts[parts.length - 1];
                    
                    System.out.println("Puerto 8000 ocupado por PID: " + pid + ". Matándolo ahora...");
                    new ProcessBuilder("taskkill", "/F", "/PID", pid).start().waitFor();
                    System.out.println("Proceso fantasma eliminado. El puerto está libre.");
                }
            }
        } catch (Exception e) {
            System.err.println("No se pudo limpiar el puerto automáticamente: " + e.getMessage());
        }
    }

@EventListener(ApplicationReadyEvent.class)
    public void launchBrowser() {
        
        if (System.getProperty("browser.opened") == null) {
            
            
            System.setProperty("browser.opened", "true");

            try {
                String url = "http://localhost:8080";
                
                
                System.setProperty("java.awt.headless", "false"); 

                if (Desktop.isDesktopSupported() && Desktop.getDesktop().isSupported(Desktop.Action.BROWSE)) {
                    Desktop.getDesktop().browse(new URI(url));
                } else {
                    
                    Runtime.getRuntime().exec("rundll32 url.dll,FileProtocolHandler " + url);
                }
            } catch (Exception e) {
                System.err.println("⚠ No se pudo abrir el navegador automáticamente.");
            }
        }
    }


}