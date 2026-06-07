package com.PFE.Segmentation_Service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "segmentation")
public class Segmentation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recommendation_reference")
    private Integer recommendationReference;

    @Column(name = "offer_reference")
    private Integer offerReference;

    @Column(name = "offer_name")
    private String offerName;

    @Column(name = "total_recommended_clients")
    private int totalRecommendedClients;

    @Column(name = "minimum_avg_traf_data")
    private Double minimumAvgTrafData;

    @Column(name = "minimum_avg_traf_voice")
    private Double minimumAvgTrafVoice;

    @Column(name = "minimum_avg_revenue")
    private Double minimumAvgRevenue;

    @Column(name = "value_client")
    private String valueClient; // Low, Medium, High

    @Column(name = "activity")
    private String activity; // Loyal, Inactive

    @Column(name = "activity_percentage")
    private Double activityPercentage;

    public Segmentation() {
    }

    // ===== GETTERS & SETTERS =====

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getRecommendationReference() {
        return recommendationReference;
    }

    public void setRecommendationReference(Integer recommendationReference) {
        this.recommendationReference = recommendationReference;
    }

    public Integer getOfferReference() {
        return offerReference;
    }

    public void setOfferReference(Integer offerReference) {
        this.offerReference = offerReference;
    }

    public String getOfferName() {
        return offerName;
    }

    public void setOfferName(String offerName) {
        this.offerName = offerName;
    }

    public int getTotalRecommendedClients() {
        return totalRecommendedClients;
    }

    public void setTotalRecommendedClients(int totalRecommendedClients) {
        this.totalRecommendedClients = totalRecommendedClients;
    }

    public Double getMinimumAvgTrafData() {
        return minimumAvgTrafData;
    }

    public void setMinimumAvgTrafData(Double minimumAvgTrafData) {
        this.minimumAvgTrafData = minimumAvgTrafData;
    }

    public Double getMinimumAvgTrafVoice() {
        return minimumAvgTrafVoice;
    }

    public void setMinimumAvgTrafVoice(Double minimumAvgTrafVoice) {
        this.minimumAvgTrafVoice = minimumAvgTrafVoice;
    }

    public Double getMinimumAvgRevenue() {
        return minimumAvgRevenue;
    }

    public void setMinimumAvgRevenue(Double minimumAvgRevenue) {
        this.minimumAvgRevenue = minimumAvgRevenue;
    }

    public String getValueClient() {
        return valueClient;
    }

    public void setValueClient(String valueClient) {
        this.valueClient = valueClient;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public Double getActivityPercentage() {
        return activityPercentage;
    }

    public void setActivityPercentage(Double activityPercentage) {
        this.activityPercentage = activityPercentage;
    }
}