package com.PFE.Analytics_Service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "analytics")
public class Analytics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recommendation_reference")
    private Integer recommendationReference;

    @Column(name = "total_clients")
    private Integer totalClients;

    @Column(name = "top_offer_recommended_reference")
    private Integer topOfferRecommendedReference;

    @Column(name = "top_offer_recommended_name")
    private String topOfferRecommendedName;

    @Column(name = "upsell_percentage")
    private Double upsellPercentage;

    @Column(name = "downsell_percentage")
    private Double downsellPercentage;

    @Column(name = "stable_percentage")
    private Double stablePercentage;

    @Column(name = "estimated_conversion_rate")
    private Double EstimatedConversionRate;

    @Column(name = "average_recommendation_score")
    private Double AverageRecommendationScore;

    @Column(name = "average_data")
    private Double averageData;

    @Column(name = "average_voice")
    private Double averageVoice;

    @Column(name = "average_arpu")
    private Double averageArpu;

    public Analytics() {
    }

    // ===== Getters & Setters =====

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

    public Integer getTotalClients() {
        return totalClients;
    }

    public void setTotalClients(Integer totalClients) {
        this.totalClients = totalClients;
    }

    public Integer getTopOfferRecommendedReference() {
        return topOfferRecommendedReference;
    }

    public void setTopOfferRecommendedReference(Integer topOfferRecommendedReference) {
        this.topOfferRecommendedReference = topOfferRecommendedReference;
    }

    public String getTopOfferRecommendedName() {
        return topOfferRecommendedName;
    }

    public void setTopOfferRecommendedName(String topOfferRecommendedName) {
        this.topOfferRecommendedName = topOfferRecommendedName;
    }

    public Double getAverageArpu() {
        return averageArpu;
    }

    public void setAverageArpu(Double averageArpu) {
        this.averageArpu = averageArpu;
    }

    public Double getUpsellPercentage() {
        return upsellPercentage;
    }

    public void setUpsellPercentage(Double upsellPercentage) {
        this.upsellPercentage = upsellPercentage;
    }

    public Double getDownsellPercentage() {
        return downsellPercentage;
    }

    public void setDownsellPercentage(Double downsellPercentage) {
        this.downsellPercentage = downsellPercentage;
    }

    public Double getStablePercentage() {
        return stablePercentage;
    }

    public void setStablePercentage(Double stablePercentage) {
        this.stablePercentage = stablePercentage;
    }

    public Double getEstimatedConversionRate() {
        return EstimatedConversionRate;
    }

    public void setEstimatedConversionRate(Double EstimatedConversionRate) {
        this.EstimatedConversionRate = EstimatedConversionRate;
    }

    public Double getAverageRecommendationScore() {
        return AverageRecommendationScore;
    }

    public void setAverageRecommendationScore(Double AverageRecommendationScore) {
        this.AverageRecommendationScore = AverageRecommendationScore;
    }

    public Double getAverageData() {
        return averageData;
    }

    public void setAverageData(Double averageData) {
        this.averageData = averageData;
    }

    public Double getAverageVoice() {
        return averageVoice;
    }

    public void setAverageVoice(Double averageVoice) {
        this.averageVoice = averageVoice;
    }
}