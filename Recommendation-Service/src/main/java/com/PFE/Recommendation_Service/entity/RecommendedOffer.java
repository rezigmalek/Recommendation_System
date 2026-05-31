package com.PFE.Recommendation_Service.entity;

public class RecommendedOffer {

    private Integer offerReference;

    private Double score;

    public RecommendedOffer() {}

    // ===== GETTERS & SETTERS =====

    public Integer getOfferReference() {
        return offerReference;
    }

    public void setOfferReference(Integer offerReference) {
        this.offerReference = offerReference;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }
}