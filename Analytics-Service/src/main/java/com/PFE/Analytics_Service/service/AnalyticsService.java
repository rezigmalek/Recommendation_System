package com.PFE.Analytics_Service.service;

import com.PFE.Analytics_Service.entity.Analytics;
import com.PFE.Analytics_Service.repository.AnalyticsRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnalyticsService {

    private final AnalyticsRepository analyticsRepository;

    public AnalyticsService(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    public Analytics createAnalytics(Analytics analytics) {
        return analyticsRepository.save(analytics);
    }

    public List<Analytics> getByRecommendationReference(Integer recommendationReference) {
        return analyticsRepository.findByRecommendationReference(recommendationReference);
    }

    public Analytics getLastAnalytics() {
        return analyticsRepository.findTopByOrderByIdDesc();
    }
}