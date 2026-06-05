package com.PFE.Offer_Service.controller;

import com.PFE.Offer_Service.entity.Offer;
import com.PFE.Offer_Service.service.OfferService;
import com.PFE.Offer_Service.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
public class OfferController {

    private final OfferService offerService;

    public OfferController(OfferService offerService) {
        this.offerService = offerService;
    }

    // ===================== UPLOAD EXCEL =====================
    @PostMapping("/upload")
    public ResponseEntity<ApiResponse<List<Offer>>> uploadOffersExcel(
            @RequestParam("file") MultipartFile file) {

        List<Offer> result = offerService.importOffersFromExcel(file);

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "Offers imported successfully",
                        true,
                        result
                )
        );
    }

    // ===================== GET ALL OFFERS =====================
    @GetMapping
    public ResponseEntity<ApiResponse<List<Offer>>> getAllOffers() {

        List<Offer> offers = offerService.getAllOffers();

        return ResponseEntity.ok(
                new ApiResponse<>(
                        "Offers retrieved successfully",
                        true,
                        offers
                )
        );
    }
}