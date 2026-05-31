package com.PFE.Segmentation_Service.repository;

import com.PFE.Segmentation_Service.entity.Segmentation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SegmentationRepository extends JpaRepository<Segmentation, Long> {

    List<Segmentation> findByRecommendationReference(Integer recommendationReference);

    List<Segmentation> findByOfferReference(Integer offerReference);
}