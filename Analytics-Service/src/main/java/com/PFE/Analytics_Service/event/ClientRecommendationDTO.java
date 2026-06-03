package com.PFE.Analytics_Service.event;

import java.util.List;

public class ClientRecommendationDTO {

    private ClientDTO client;
    private List<RecommendedOfferDTO> recommendedOffers;

    public ClientRecommendationDTO() {}

    public ClientDTO getClient()                          { return client; }
    public void setClient(ClientDTO client)               { this.client = client; }
    public List<RecommendedOfferDTO> getRecommendedOffers() { return recommendedOffers; }
    public void setRecommendedOffers(List<RecommendedOfferDTO> r) { this.recommendedOffers = r; }
}