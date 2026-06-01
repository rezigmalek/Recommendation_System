package com.PFE.Recommendation_Service.entity;

import java.util.List;

public class ClientRecommendation {

    private Client client;
    private List<RecommendedOffer> recommendedOffers;

    public ClientRecommendation() {
    }

    public ClientRecommendation(Client client, List<RecommendedOffer> recommendedOffers) {
        this.client = client;
        this.recommendedOffers = recommendedOffers;
    }

    // ================= GETTERS =================

    public Client getClient() {
        return client;
    }

    public List<RecommendedOffer> getRecommendedOffers() {
        return recommendedOffers;
    }

    // ================= SETTERS =================

    public void setClient(Client client) {
        this.client = client;
    }

    public void setRecommendedOffers(List<RecommendedOffer> recommendedOffers) {
        this.recommendedOffers = recommendedOffers;
    }
}