package com.PFE.UsageHistory_Service.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "usage_history")
public class UsageHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "recommendation_reference")
    private Integer recommendationReference;

    @Column(name = "date")
    private LocalDateTime date;

    @Column(name = "total_clients")
    private Integer totalClients;

    @Column(name = "total_offers")
    private Integer totalOffers;

    public UsageHistory() {
    }

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

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public Integer getTotalClients() {
        return totalClients;
    }

    public void setTotalClients(Integer totalClients) {
        this.totalClients = totalClients;
    }

    public Integer getTotalOffers() {
        return totalOffers;
    }

    public void setTotalOffers(Integer totalOffers) {
        this.totalOffers = totalOffers;
    }
}