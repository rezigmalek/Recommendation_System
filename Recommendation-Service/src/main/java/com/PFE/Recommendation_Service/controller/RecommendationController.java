package com.PFE.Recommendation_Service.controller;

import com.PFE.Recommendation_Service.entity.Recommendation;
import com.PFE.Recommendation_Service.response.ApiResponse;
import com.PFE.Recommendation_Service.service.RecommendationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    // simulate auto increment (simple PFE version)
    private static final AtomicInteger counter = new AtomicInteger(1000);

    public RecommendationController(
            RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    // ================= CREATE =================

    @PostMapping
    public ResponseEntity<Recommendation> createRecommendation(
            @RequestBody Recommendation recommendation) {

        // generate recommendationReference automatically
        recommendation.setRecommendationReference(
                counter.incrementAndGet());

        Recommendation saved = recommendationService.createRecommendation(recommendation);

        return ResponseEntity.ok(saved);
    }

    // ================= GET ALL =================

    @GetMapping
    public ResponseEntity<List<Recommendation>> getAll() {

        return ResponseEntity.ok(
                recommendationService.getAllRecommendations());
    }

    // ================= GET BY REFERENCE =================

    @GetMapping("/{reference}")
    public ResponseEntity<Recommendation> getByReference(
            @PathVariable Number reference) {

        Recommendation recommendation = recommendationService.getByRecommendationReference(reference);

        if (recommendation == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(recommendation);
    }

    // ================= GET NEXT RECOMMENDATION REFERENCE =================

    @GetMapping("/next-reference")
    public ResponseEntity<Number> getNextReference() {
        return ResponseEntity.ok(recommendationService.getNextSequence());
    }

    // ================= UPLOAD FILES & RECOMMEND =================

    @PostMapping("/upload-data")
    public ResponseEntity<ApiResponse<Recommendation>> uploadFiles(
            @RequestParam("clientsFile") MultipartFile clientsFile,
            @RequestParam("offersFile") MultipartFile offersFile,
            @RequestParam(value = "topN", defaultValue = "3") int topN) {

        try {

            Recommendation recommendation = recommendationService.processFilesAndRecommend(
                    clientsFile,
                    offersFile,
                    topN);

            return ResponseEntity.ok(
                    new ApiResponse<>(
                            "Files processed successfully",
                            true,
                            recommendation));

        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new ApiResponse<>(
                            "Error while processing files: " + e.getMessage(),
                            false,
                            null));
        }
    }

}