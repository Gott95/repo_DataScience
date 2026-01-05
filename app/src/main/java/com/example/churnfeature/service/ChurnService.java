package com.example.churnfeature.service;

import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.example.churnfeature.dto.ChurnRequestDTO;
import com.example.churnfeature.dto.ChurnResponseDTO;
import com.example.churnfeature.model.ChurnPredictionEntity;
import com.example.churnfeature.repository.ChurnRepository;

@Service
public class ChurnService {

    private final ChurnRepository repository;
    private final RestTemplate restTemplate;
    private static final String PREDICT_URL = "http://localhost:8000/predict";

    public ChurnService(ChurnRepository repository, RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    public ChurnResponseDTO predictAndSave(ChurnRequestDTO request) {
        ChurnResponseDTO responseDTO;
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<ChurnRequestDTO> entity = new HttpEntity<>(request, headers);

            ResponseEntity<ChurnResponseDTO> resp = restTemplate.postForEntity(PREDICT_URL, entity,
                    ChurnResponseDTO.class);
            responseDTO = resp.getBody();
            if (responseDTO == null) {
                responseDTO = new ChurnResponseDTO("unknown", 0.0, "empty_response");
            } else {
                responseDTO.setStatus("ok");
            }
        } catch (RestClientException ex) {
            responseDTO = new ChurnResponseDTO("error", 0.0, "python_unavailable");
        } catch (Exception ex) {
            responseDTO = new ChurnResponseDTO("error", 0.0, "internal_error");
        }

        // Map to entity and persist
        try {
            ChurnPredictionEntity entity = new ChurnPredictionEntity();
            entity.setCustomerId(null);
            entity.setTenure(request.getTenure());
            entity.setTotalSpend(request.getTotalSpend());
            entity.setPrediction(responseDTO.getPrediction());
            entity.setProbability(responseDTO.getProbability());
            repository.save(entity);
        } catch (Exception ex) {
            // swallow persistence exception but keep returning the response DTO
        }

        return responseDTO;
    }

    public java.util.List<com.example.churnfeature.model.ChurnPredictionEntity> getAllPredictions() {
        return repository.findAllByOrderByCreatedAtDesc();
    }
}
