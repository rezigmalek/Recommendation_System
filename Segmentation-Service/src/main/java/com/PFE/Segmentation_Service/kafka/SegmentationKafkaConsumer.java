package com.PFE.Segmentation_Service.kafka;

import com.PFE.Segmentation_Service.entity.Segmentation;
import com.PFE.Segmentation_Service.event.ClientRecommendationDTO;
import com.PFE.Segmentation_Service.event.RecommendationCreatedEvent;
import com.PFE.Segmentation_Service.event.RecommendedOfferDTO;
import com.PFE.Segmentation_Service.repository.SegmentationRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Component
public class SegmentationKafkaConsumer {

    private static final Logger log = LoggerFactory.getLogger(SegmentationKafkaConsumer.class);

    private final SegmentationRepository segmentationRepository;

    public SegmentationKafkaConsumer(SegmentationRepository segmentationRepository) {
        this.segmentationRepository = segmentationRepository;
    }

    @Transactional
    @KafkaListener(topics = "recommendation.created", groupId = "segmentation-service", containerFactory = "kafkaListenerContainerFactory")
    public void onRecommendationCreated(RecommendationCreatedEvent event) {

        if (event == null || event.getRecommendation() == null)
            return;

        log.info("Segmentation-Service received event [id={}]", event.getEventId());

        Integer recommendationRef = event.getRecommendation().getRecommendationReference();
        List<ClientRecommendationDTO> clients = event.getRecommendation().getClientsRecommendations();

        if (clients == null || clients.isEmpty())
            return;

        // =================================================
        // GROUPER LES CLIENTS PAR OFFRE TOP1
        // =================================================
        Map<Integer, List<ClientRecommendationDTO>> clientsByOffer = new HashMap<>();

        for (ClientRecommendationDTO cr : clients) {
            if (cr.getRecommendedOffers() == null || cr.getRecommendedOffers().isEmpty())
                continue;

            RecommendedOfferDTO top1 = cr.getRecommendedOffers().get(0);
            Integer offerRef = top1.getOfferReference();

            clientsByOffer
                    .computeIfAbsent(offerRef, k -> new ArrayList<>())
                    .add(cr);
        }

        // =================================================
        // POUR CHAQUE OFFRE → CALCULER LE SEGMENT
        // =================================================
        for (Map.Entry<Integer, List<ClientRecommendationDTO>> entry : clientsByOffer.entrySet()) {

            Integer offerRef = entry.getKey();
            List<ClientRecommendationDTO> offerClients = entry.getValue();

            String offerName = offerClients.get(0)
                    .getRecommendedOffers().get(0).getOfferName();

            // ── Minimum AVG Traf Data ──────────────────────────
            double minAvgTrafData = offerClients.stream()
                    .filter(cr -> cr.getClient().getAvgVolumeDataMo() != null)
                    .mapToDouble(cr -> cr.getClient().getAvgVolumeDataMo())
                    .min().orElse(0.0);

            // ── Minimum AVG Traf Voice ─────────────────────────
            double minAvgTrafVoice = offerClients.stream()
                    .filter(cr -> cr.getClient().getAvgTrafTotal() != null)
                    .mapToDouble(cr -> cr.getClient().getAvgTrafTotal())
                    .min().orElse(0.0);

            // ── Minimum AVG Revenue ────────────────────────────
            double minAvgRevenue = offerClients.stream()
                    .filter(cr -> cr.getClient().getAvgRealRev() != null)
                    .mapToDouble(cr -> cr.getClient().getAvgRealRev())
                    .min().orElse(0.0);

            // ── Value Client majoritaire ───────────────────────
            String dominantValueClient = getMostFrequent(
                    offerClients.stream()
                            .map(cr -> cr.getClient().getValueSegment())
                            .filter(Objects::nonNull)
                            .collect(Collectors.toList()));

            // ── Compter actifs (1) et inactifs (0) ────────────
            long activeCount = offerClients.stream()
                    .filter(cr -> cr.getClient().getFlagActivity() == 1)
                    .count();

            long inactiveCount = offerClients.stream()
                    .filter(cr -> cr.getClient().getFlagActivity() == 0)
                    .count();

            // ── Activity dominante : "Active" ou "Inactive" ───
            String dominantActivity = activeCount >= inactiveCount ? "Active" : "Inactive";

            // ── Activity Percentage (% de la dominante) ───────
            long dominantCount = activeCount >= inactiveCount ? activeCount : inactiveCount;
            double activityPercentage = ((double) dominantCount / offerClients.size()) * 100;

            // ── Sauvegarder ────────────────────────────────────
            Segmentation segmentation = new Segmentation();
            segmentation.setRecommendationReference(recommendationRef);
            segmentation.setOfferReference(offerRef);
            segmentation.setOfferName(offerName);
            segmentation.setMinimumAvgTrafData(minAvgTrafData);
            segmentation.setMinimumAvgTrafVoice(minAvgTrafVoice);
            segmentation.setMinimumAvgRevenue(minAvgRevenue);
            segmentation.setValueClient(dominantValueClient);
            segmentation.setActivity(dominantActivity);
            segmentation.setActivityPercentage(activityPercentage);
            segmentation.setTotalRecommendedClients(offerClients.size());

            segmentationRepository.save(segmentation);

            log.info("Segmentation saved [offer={} | clients={} | active={} | inactive={} | activity={}]",
                    offerName, offerClients.size(), activeCount, inactiveCount, dominantActivity);
        }
    }

    // =================================================
    // HELPER : valeur la plus fréquente dans une liste
    // =================================================
    private String getMostFrequent(List<String> values) {
        if (values == null || values.isEmpty())
            return "Unknown";

        return values.stream()
                .collect(Collectors.groupingBy(v -> v, Collectors.counting()))
                .entrySet().stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("Unknown");
    }
}