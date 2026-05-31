package com.PFE.Analytics_Service.repository;

import com.PFE.Analytics_Service.entity.Analytics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AnalyticsRepository extends JpaRepository<Analytics, Long> {

    List<Analytics> findByRecommendationReference(Integer recommendationReference);

    Analytics findTopByOrderByIdDesc();
}