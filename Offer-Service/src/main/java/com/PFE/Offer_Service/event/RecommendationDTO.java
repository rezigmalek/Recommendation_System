package com.PFE.Offer_Service.event;

import java.util.List;

public class RecommendationDTO {

    private Integer recommendationReference;
    private List<ClientRecommendationDTO> clientsRecommendations;

    public RecommendationDTO() {}

    public Integer getRecommendationReference()               { return recommendationReference; }
    public void setRecommendationReference(Integer r)         { this.recommendationReference = r; }
    public List<ClientRecommendationDTO> getClientsRecommendations() { return clientsRecommendations; }
    public void setClientsRecommendations(List<ClientRecommendationDTO> c) { this.clientsRecommendations = c; }
}
