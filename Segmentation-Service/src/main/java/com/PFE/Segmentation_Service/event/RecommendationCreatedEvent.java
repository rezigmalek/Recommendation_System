package com.PFE.Segmentation_Service.event;

import java.time.LocalDateTime;

public class RecommendationCreatedEvent {

    private String eventId;
    private LocalDateTime createdAt;
    private RecommendationDTO recommendation;

    public RecommendationCreatedEvent() {}

    public String getEventId()                        { return eventId; }
    public void setEventId(String eventId)            { this.eventId = eventId; }
    public LocalDateTime getCreatedAt()               { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public RecommendationDTO getRecommendation()      { return recommendation; }
    public void setRecommendation(RecommendationDTO r){ this.recommendation = r; }
}