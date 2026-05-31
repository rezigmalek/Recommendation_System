package com.PFE.UsageHistory_Service.controller;

import com.PFE.UsageHistory_Service.entity.UsageHistory;
import com.PFE.UsageHistory_Service.response.ApiResponse;
import com.PFE.UsageHistory_Service.service.UsageHistoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class UsageHistoryController {

    private final UsageHistoryService usageHistoryService;

    public UsageHistoryController(UsageHistoryService usageHistoryService) {
        this.usageHistoryService = usageHistoryService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<UsageHistory>> createHistory(
            @RequestBody UsageHistory usageHistory) {

        UsageHistory created = usageHistoryService.createHistory(usageHistory);

        ApiResponse<UsageHistory> response = new ApiResponse<>(
                "History created successfully",
                true,
                created
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<UsageHistory>>> getAllHistory() {

        List<UsageHistory> list = usageHistoryService.getAllHistory();

        ApiResponse<List<UsageHistory>> response = new ApiResponse<>(
                "History retrieved successfully",
                true,
                list
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UsageHistory>> getHistoryById(
            @PathVariable Long id) {

        UsageHistory history = usageHistoryService.getHistoryById(id);

        if (history == null) {
            ApiResponse<UsageHistory> response = new ApiResponse<>(
                    "History not found",
                    false,
                    null
            );
            return ResponseEntity.status(404).body(response);
        }

        ApiResponse<UsageHistory> response = new ApiResponse<>(
                "History retrieved successfully",
                true,
                history
        );

        return ResponseEntity.ok(response);
    }

    @GetMapping("/recommendation/{reference}")
    public ResponseEntity<ApiResponse<List<UsageHistory>>> getByRecommendationReference(
            @PathVariable Integer reference) {

        List<UsageHistory> list =
                usageHistoryService.getByRecommendationReference(reference);

        ApiResponse<List<UsageHistory>> response = new ApiResponse<>(
                "History filtered by recommendation reference",
                true,
                list
        );

        return ResponseEntity.ok(response);
    }
}