package com.PFE.Segmentation_Service.controller;

import com.PFE.Segmentation_Service.entity.Segmentation;
import com.PFE.Segmentation_Service.response.ApiResponse;
import com.PFE.Segmentation_Service.service.SegmentationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/segmentation")
public class SegmentationController {

    private final SegmentationService segmentationService;

    public SegmentationController(SegmentationService segmentationService) {
        this.segmentationService = segmentationService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Segmentation>> createSegmentation(
            @RequestBody Segmentation segmentation) {

        Segmentation created = segmentationService.createSegmentation(segmentation);

        ApiResponse<Segmentation> response = new ApiResponse<>(
                "Segmentation created successfully",
                true,
                created
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/recommendation/{reference}")
    public ResponseEntity<ApiResponse<List<Segmentation>>> getByRecommendationReference(
            @PathVariable Integer reference) {

        List<Segmentation> list =
                segmentationService.getByRecommendationReference(reference);

        ApiResponse<List<Segmentation>> response = new ApiResponse<>(
                "Segmentation retrieved by recommendation reference",
                true,
                list
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/offer/{reference}")
    public ResponseEntity<ApiResponse<List<Segmentation>>> getByOfferReference(
            @PathVariable Integer reference) {

        List<Segmentation> list =
                segmentationService.getByOfferReference(reference);

        ApiResponse<List<Segmentation>> response = new ApiResponse<>(
                "Segmentation retrieved by offer reference",
                true,
                list
        );

        return ResponseEntity.ok(response);
    }
}