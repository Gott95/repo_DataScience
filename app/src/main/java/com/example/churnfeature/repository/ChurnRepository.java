package com.example.churnfeature.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.churnfeature.model.ChurnPredictionEntity;

public interface ChurnRepository extends JpaRepository<ChurnPredictionEntity, Long> {

    java.util.List<com.example.churnfeature.model.ChurnPredictionEntity> findAllByOrderByCreatedAtDesc();

}
