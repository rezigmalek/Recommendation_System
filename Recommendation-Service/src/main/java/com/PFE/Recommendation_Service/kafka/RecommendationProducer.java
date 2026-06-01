package com.PFE.Recommendation_Service.kafka;

import com.PFE.Recommendation_Service.entity.Recommendation;
import com.PFE.Recommendation_Service.event.RecommendationCreatedEvent;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Component;
import java.util.concurrent.CompletableFuture;

@Component
public class RecommendationProducer {

    private static final Logger log = LoggerFactory.getLogger(RecommendationProducer.class);

    private final KafkaTemplate<String, RecommendationCreatedEvent> kafkaTemplate;

    @Value("${kafka.topic.recommendation}")
    private String topicName;

    public RecommendationProducer(
            KafkaTemplate<String, RecommendationCreatedEvent> kafkaTemplate) {
        this.kafkaTemplate = kafkaTemplate;
    }

    public void publishRecommendationCreated(Recommendation recommendation) {

        RecommendationCreatedEvent event = new RecommendationCreatedEvent(recommendation);

        // La clé = recommendationReference → garantit l'ordre des messages
        String key = String.valueOf(recommendation.getRecommendationReference());

        CompletableFuture<SendResult<String, RecommendationCreatedEvent>> future =
                kafkaTemplate.send(topicName, key, event);

        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to publish RecommendationCreatedEvent [ref={}] : {}",
                        recommendation.getRecommendationReference(), ex.getMessage());
            } else {
                log.info("RecommendationCreatedEvent published [ref={}] → topic={} partition={} offset={}",
                        recommendation.getRecommendationReference(),
                        result.getRecordMetadata().topic(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            }
        });
    }
}