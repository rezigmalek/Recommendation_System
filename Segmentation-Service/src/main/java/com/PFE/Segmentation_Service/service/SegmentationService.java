package com.PFE.Segmentation_Service.service;

import com.PFE.Segmentation_Service.entity.Segmentation;
import com.PFE.Segmentation_Service.repository.SegmentationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SegmentationService {

    private final SegmentationRepository segmentationRepository;

    public SegmentationService(SegmentationRepository segmentationRepository) {
        this.segmentationRepository = segmentationRepository;
    }

    public Segmentation createSegmentation(Segmentation segmentation) {
        return segmentationRepository.save(segmentation);
    }

    public List<Segmentation> getByRecommendationReference(Integer recommendationReference) {
        return segmentationRepository.findByRecommendationReference(recommendationReference);
    }

    public List<Segmentation> getByOfferReference(Integer offerReference) {
        return segmentationRepository.findByOfferReference(offerReference);
    }
}