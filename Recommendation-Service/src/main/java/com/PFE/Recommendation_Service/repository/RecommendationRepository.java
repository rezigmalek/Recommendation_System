package com.PFE.Recommendation_Service.repository;

import com.PFE.Recommendation_Service.entity.Recommendation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.Optional;

public interface RecommendationRepository
        extends MongoRepository<Recommendation, String> {

    @Query("{ 'recommendationReference' : { $eq: ?0 } }")
    Optional<Recommendation> findByRecommendationReference(Number reference);
}