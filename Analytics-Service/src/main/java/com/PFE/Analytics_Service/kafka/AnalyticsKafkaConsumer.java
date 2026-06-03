package com.PFE.Analytics_Service.kafka;

import com.PFE.Analytics_Service.entity.Analytics;
import com.PFE.Analytics_Service.event.ClientRecommendationDTO;
import com.PFE.Analytics_Service.event.RecommendationCreatedEvent;
import com.PFE.Analytics_Service.event.RecommendedOfferDTO;
import com.PFE.Analytics_Service.repository.AnalyticsRepository;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class AnalyticsKafkaConsumer {

    private final AnalyticsRepository analyticsRepository;

    public AnalyticsKafkaConsumer(AnalyticsRepository analyticsRepository) {
        this.analyticsRepository = analyticsRepository;
    }

    @Transactional
    @KafkaListener(
            topics = "recommendation.created",
            groupId = "analytics-service",
            containerFactory = "kafkaListenerContainerFactory"
    )
    public void onRecommendationCreated(RecommendationCreatedEvent event) {

        if (event == null || event.getRecommendation() == null) {
            return;
        }

        List<ClientRecommendationDTO> clients =
                event.getRecommendation().getClientsRecommendations();

        if (clients == null || clients.isEmpty()) {
            return;
        }

        int totalClients = clients.size();

        // =====================================================
        // TOP OFFER
        // =====================================================

        Map<Integer, Integer> offerFrequency = new HashMap<>();
        Map<Integer, String> offerNames = new HashMap<>();

        for (ClientRecommendationDTO clientRec : clients) {

            if (clientRec.getRecommendedOffers() == null ||
                    clientRec.getRecommendedOffers().isEmpty()) {
                continue;
            }

            RecommendedOfferDTO topOffer =
                    clientRec.getRecommendedOffers().get(0);

            Integer ref = topOffer.getOfferReference();

            offerFrequency.put(
                    ref,
                    offerFrequency.getOrDefault(ref, 0) + 1
            );

            offerNames.put(ref, topOffer.getOfferName());
        }

        Integer topOfferReference = null;
        String topOfferName = null;

        int maxCount = 0;

        for (Map.Entry<Integer, Integer> entry : offerFrequency.entrySet()) {

            if (entry.getValue() > maxCount) {

                maxCount = entry.getValue();
                topOfferReference = entry.getKey();
                topOfferName = offerNames.get(entry.getKey());
            }
        }

        // =====================================================
        // UPSELL / DOWNSELL / STABLE
        // =====================================================

        long upsell = 0;
        long downsell = 0;
        long stable = 0;

        double totalScore = 0.0;
        double totalWeight = 0.0;

        for (ClientRecommendationDTO clientRec : clients) {

            if (clientRec.getRecommendedOffers() == null ||
                    clientRec.getRecommendedOffers().isEmpty()) {
                continue;
            }

            RecommendedOfferDTO top1 =
                    clientRec.getRecommendedOffers().get(0);

            Double currentPrice =
                    clientRec.getClient().getClientPastOfferPrice();

            Double recommendedPrice =
                    top1.getPrice();

            if (currentPrice != null && recommendedPrice != null) {

                if (recommendedPrice > currentPrice) {
                    upsell++;
                } else if (recommendedPrice < currentPrice) {
                    downsell++;
                } else {
                    stable++;
                }
            }

            if (top1.getScore() != null) {

                double score = top1.getScore();

                totalScore += score;
                totalWeight += getConversionWeight(score);
            }
        }

        double upsellPercentage =
                ((double) upsell / totalClients) * 100;

        double downsellPercentage =
                ((double) downsell / totalClients) * 100;

        double stablePercentage =
                ((double) stable / totalClients) * 100;

        double averageRecommendationScore =
                totalScore / totalClients;

        double estimatedConversionRate =
                (totalWeight / totalClients) * 100;

        // =====================================================
        // AVERAGE DATA
        // =====================================================

        double averageData = clients.stream()
                .filter(c -> c.getClient() != null
                        && c.getClient().getAvgVolumeDataMo() != null)
                .mapToDouble(c -> c.getClient().getAvgVolumeDataMo())
                .average()
                .orElse(0.0);

        // =====================================================
        // AVERAGE VOICE
        // =====================================================

        double averageVoice = clients.stream()
                .filter(c -> c.getClient() != null
                        && c.getClient().getAvgTrafTotal() != null)
                .mapToDouble(c -> c.getClient().getAvgTrafTotal())
                .average()
                .orElse(0.0);

        // =====================================================
        // AVERAGE ARPU
        // =====================================================

        double averageArpu = clients.stream()
                .filter(c -> c.getClient() != null
                        && c.getClient().getAvgRealRev() != null)
                .mapToDouble(c -> c.getClient().getAvgRealRev())
                .average()
                .orElse(0.0);

        // =====================================================
        // SAVE
        // =====================================================

        Analytics analytics = new Analytics();

        analytics.setRecommendationReference(
                event.getRecommendation().getRecommendationReference());

        analytics.setTotalClients(totalClients);

        analytics.setTopOfferRecommendedReference(topOfferReference);

        analytics.setTopOfferRecommendedName(topOfferName);

        analytics.setUpsellPercentage(upsellPercentage);

        analytics.setDownsellPercentage(downsellPercentage);

        analytics.setStablePercentage(stablePercentage);

        analytics.setEstimatedConversionRate(
                estimatedConversionRate);

        analytics.setAverageRecommendationScore(
                averageRecommendationScore);

        analytics.setAverageData(averageData);

        analytics.setAverageVoice(averageVoice);

        analytics.setAverageArpu(averageArpu);

        analyticsRepository.save(analytics);

        System.out.println(
                "Analytics saved for recommendation "
                        + analytics.getRecommendationReference());
    }

    private double getConversionWeight(double score) {

        // Si tes scores sont de type 0-100
        if (score >= 90) return 1.0;
        if (score >= 80) return 0.8;
        if (score >= 70) return 0.6;
        if (score >= 60) return 0.4;
        if (score >= 50) return 0.2;

        return 0.0;
    }
}