package com.PFE.Analytics_Service.controller;

import com.PFE.Analytics_Service.entity.Analytics;
import com.PFE.Analytics_Service.response.ApiResponse;
import com.PFE.Analytics_Service.service.AnalyticsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    public AnalyticsController(AnalyticsService analyticsService) {
        this.analyticsService = analyticsService;
    }

    // ✅ POST - create analytics
    @PostMapping
    public ResponseEntity<ApiResponse<Analytics>> createAnalytics(
            @RequestBody Analytics analytics) {

        Analytics created = analyticsService.createAnalytics(analytics);

        ApiResponse<Analytics> response = new ApiResponse<>(
                "Analytics created successfully",
                true,
                created
        );

        return ResponseEntity.ok(response);
    }

    // ✅ GET - by recommendation_reference
    @GetMapping("/recommendation/{reference}")
    public ResponseEntity<ApiResponse<List<Analytics>>> getByRecommendationReference(
            @PathVariable Integer reference) {

        List<Analytics> list =
                analyticsService.getByRecommendationReference(reference);

        ApiResponse<List<Analytics>> response = new ApiResponse<>(
                "Analytics retrieved by recommendation reference",
                true,
                list
        );

        return ResponseEntity.ok(response);
    }

    // ✅ GET - last inserted analytics
    @GetMapping("/last")
    public ResponseEntity<ApiResponse<Analytics>> getLastAnalytics() {

        Analytics last = analyticsService.getLastAnalytics();

        ApiResponse<Analytics> response = new ApiResponse<>(
                "Last analytics retrieved successfully",
                true,
                last
        );

        return ResponseEntity.ok(response);
    }
}