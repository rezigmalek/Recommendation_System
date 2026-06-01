package com.PFE.Recommendation_Service.event;

import com.PFE.Recommendation_Service.entity.Recommendation;
import java.time.LocalDateTime;
import java.util.UUID;

public class RecommendationCreatedEvent {

    private String eventId;
    private LocalDateTime createdAt;
    private Recommendation recommendation;

    // Constructeur vide obligatoire pour la sérialisation JSON
    public RecommendationCreatedEvent() {}

    public RecommendationCreatedEvent(Recommendation recommendation) {
        this.eventId        = UUID.randomUUID().toString();
        this.createdAt      = LocalDateTime.now();
        this.recommendation = recommendation;
    }

    // ===== Getters & Setters =====
    public String getEventId()                         { return eventId; }
    public void setEventId(String eventId)             { this.eventId = eventId; }
    public LocalDateTime getCreatedAt()                { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt)  { this.createdAt = createdAt; }
    public Recommendation getRecommendation()          { return recommendation; }
    public void setRecommendation(Recommendation r)    { this.recommendation = r; }
}