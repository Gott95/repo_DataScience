package com.example.churnfeature.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.churnfeature.dto.ChurnRequestDTO;
import com.example.churnfeature.dto.ChurnResponseDTO;
import com.example.churnfeature.service.ChurnService;
import com.example.churnfeature.dto.ChurnPredictionDTO;
import com.example.churnfeature.model.ChurnPredictionEntity;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/churn")
@CrossOrigin(origins = "http://localhost:5173")
public class ChurnRestController {

    private final ChurnService churnService;

    public ChurnRestController(ChurnService churnService) {
        this.churnService = churnService;
    }

    @PostMapping("/predict")
    public ResponseEntity<ChurnResponseDTO> predict(@RequestBody ChurnRequestDTO request) {
        ChurnResponseDTO response = churnService.predictAndSave(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ChurnPredictionDTO>> history() {
        List<ChurnPredictionEntity> entities = churnService.getAllPredictions();
        List<ChurnPredictionDTO> dtos = entities.stream().map(e -> {
            ChurnPredictionDTO d = new ChurnPredictionDTO();
            d.setId(e.getId());
            d.setCustomerId(e.getCustomerId());
            d.setTenure(e.getTenure());
            d.setTotalSpend(e.getTotalSpend());
            d.setPrediction(e.getPrediction());
            d.setProbability(e.getProbability());
            d.setCreatedAt(e.getCreatedAt());
            return d;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }
}
