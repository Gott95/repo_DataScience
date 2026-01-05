package com.example.churnfeature.dto;

public class ChurnResponseDTO {

    private String prediction;
    private Double probability;
    private String status;

    public ChurnResponseDTO() {
    }

    public ChurnResponseDTO(String prediction, Double probability, String status) {
        this.prediction = prediction;
        this.probability = probability;
        this.status = status;
    }

    public String getPrediction() {
        return prediction;
    }

    public void setPrediction(String prediction) {
        this.prediction = prediction;
    }

    public Double getProbability() {
        return probability;
    }

    public void setProbability(Double probability) {
        this.probability = probability;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
