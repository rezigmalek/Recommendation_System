package com.PFE.Recommendation_Service.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "recommendations")
public class Recommendation {

    @Id
    private String id;

    private Integer recommendationReference;

    private List<ClientRecommendation> clientsRecommendations;

    // ===== GETTERS & SETTERS =====

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Integer getRecommendationReference() {
        return recommendationReference;
    }

    public void setRecommendationReference(Integer recommendationReference) {
        this.recommendationReference = recommendationReference;
    }

    public List<ClientRecommendation> getClientsRecommendations() {
        return clientsRecommendations;
    }

    public void setClientsRecommendations(List<ClientRecommendation> clientsRecommendations) {
        this.clientsRecommendations = clientsRecommendations;
    }
}