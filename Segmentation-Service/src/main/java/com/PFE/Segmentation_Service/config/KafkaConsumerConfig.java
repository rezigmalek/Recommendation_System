package com.PFE.Segmentation_Service.config;

import com.PFE.Segmentation_Service.event.RecommendationCreatedEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.common.serialization.Deserializer;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;

import java.util.HashMap;
import java.util.Map;

@Configuration
public class KafkaConsumerConfig {

    @Value("${spring.kafka.bootstrap-servers}")
    private String bootstrapServers;

    @Value("${spring.kafka.consumer.group-id}")
    private String groupId;

    // Deserializer Jackson personnalisé
    public static class RecommendationEventDeserializer
            implements Deserializer<RecommendationCreatedEvent> {

        private final ObjectMapper objectMapper;

        public RecommendationEventDeserializer() {
            this.objectMapper = new ObjectMapper();
            this.objectMapper.registerModule(new JavaTimeModule());

            // ← AJOUTER : ignorer les champs inconnus dans le JSON
            this.objectMapper.configure(
                    com.fasterxml.jackson.databind.DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES,
                    false);
        }

        @Override
        public RecommendationCreatedEvent deserialize(String topic, byte[] data) {
            if (data == null)
                return null;
            try {
                return objectMapper.readValue(data, RecommendationCreatedEvent.class);
            } catch (Exception e) {
                // ← AJOUTER : logger l'erreur au lieu de la cacher
                System.err.println("DESERIALIZE ERROR: " + e.getMessage());
                e.printStackTrace();
                return null; // ← retourner null au lieu de throw pour ne pas bloquer
            }
        }
    }

    @Bean
    public ConsumerFactory<String, RecommendationCreatedEvent> consumerFactory() {
        Map<String, Object> config = new HashMap<>();
        config.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapServers);
        config.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
        config.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, "earliest");
        config.put(ConsumerConfig.KEY_DESERIALIZER_CLASS_CONFIG, StringDeserializer.class);
        config.put(ConsumerConfig.VALUE_DESERIALIZER_CLASS_CONFIG,
                RecommendationEventDeserializer.class);
        return new DefaultKafkaConsumerFactory<>(config);
    }

    @Bean
    public ConcurrentKafkaListenerContainerFactory<String, RecommendationCreatedEvent> kafkaListenerContainerFactory() {
        ConcurrentKafkaListenerContainerFactory<String, RecommendationCreatedEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();
        factory.setConsumerFactory(consumerFactory());
        factory.setCommonErrorHandler(new org.springframework.kafka.listener.CommonLoggingErrorHandler()); // ← AJOUTER
                                                                                                           // : afficher
                                                                                                           // l'erreur
                                                                                                           // exacte
        return factory;
    }
}
