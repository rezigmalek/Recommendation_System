package com.PFE.Recommendation_Service.config;

import com.PFE.Recommendation_Service.event.RecommendationCreatedEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.apache.kafka.clients.producer.ProducerConfig;
import org.apache.kafka.common.serialization.StringSerializer;
import org.apache.kafka.common.serialization.Serializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.core.DefaultKafkaProducerFactory;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.core.ProducerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaProducerConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    // Serializer Jackson personnalisé — remplace JsonSerializer déprécié
    public static class RecommendationEventSerializer
            implements Serializer<RecommendationCreatedEvent> {

        private final ObjectMapper objectMapper;

        public RecommendationEventSerializer() {
            this.objectMapper = new ObjectMapper();
            // Important : support de LocalDateTime
            this.objectMapper.registerModule(new JavaTimeModule());
        }

        @Override
        public byte[] serialize(String topic, RecommendationCreatedEvent data) {
            if (data == null) return null;
            try {
                return objectMapper.writeValueAsBytes(data);
            } catch (Exception e) {
                throw new RuntimeException("Failed to serialize RecommendationCreatedEvent", e);
            }
        }
    }

    @Bean
    public ProducerFactory<String, RecommendationCreatedEvent> producerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ProducerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ProducerConfig.KEY_SERIALIZER_CLASS_CONFIG, StringSerializer.class);
        config.put(ProducerConfig.VALUE_SERIALIZER_CLASS_CONFIG,
                RecommendationEventSerializer.class);
        return new DefaultKafkaProducerFactory<>(config);
    }

    @Bean
    public KafkaTemplate<String, RecommendationCreatedEvent> kafkaTemplate() {
        return new KafkaTemplate<>(producerFactory());
    }
}