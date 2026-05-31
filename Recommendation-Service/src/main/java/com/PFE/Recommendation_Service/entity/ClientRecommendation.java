package com.PFE.Recommendation_Service.entity;

import java.util.List;

public class ClientRecommendation {

    private Integer clientReference;

    private List<RecommendedOffer> recommendedOffers;

    public ClientRecommendation() {
    }

    public ClientRecommendation(Integer clientReference, List<RecommendedOffer> recommendedOffers) {
        this.clientReference = clientReference;
        this.recommendedOffers = recommendedOffers;
    }

    public Integer getClientReference() {
        return clientReference;
    }

    public void setClientReference(Integer clientReference) {
        this.clientReference = clientReference;
    }

    public List<RecommendedOffer> getRecommendedOffers() {
        return recommendedOffers;
    }

    public void setRecommendedOffers(List<RecommendedOffer> recommendedOffers) {
        this.recommendedOffers = recommendedOffers;
    }
}