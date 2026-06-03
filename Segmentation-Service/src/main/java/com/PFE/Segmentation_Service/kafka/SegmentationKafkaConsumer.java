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
    @KafkaListener(
        topics = "recommendation.created",
        groupId = "segmentation-service",
        containerFactory = "kafkaListenerContainerFactory"
    )
    public void onRecommendationCreated(RecommendationCreatedEvent event) {

        if (event == null || event.getRecommendation() == null) return;

        log.info("Segmentation-Service received event [id={}]", event.getEventId());

        Integer recommendationRef = event.getRecommendation().getRecommendationReference();
        List<ClientRecommendationDTO> clients =
                event.getRecommendation().getClientsRecommendations();

        if (clients == null || clients.isEmpty()) return;

        // =================================================
        // GROUPER LES CLIENTS PAR OFFRE TOP1
        // =================================================
        // Structure : Map<OfferReference, List<ClientRecommendationDTO>>
        Map<Integer, List<ClientRecommendationDTO>> clientsByOffer = new HashMap<>();

        for (ClientRecommendationDTO cr : clients) {
            if (cr.getRecommendedOffers() == null || cr.getRecommendedOffers().isEmpty()) continue;

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

            // Nom de l'offre depuis le top1 du premier client
            String offerName = offerClients.get(0)
                    .getRecommendedOffers().get(0).getOfferName();

            // ── Minimum AVG Traf Data ──────────────────────────
            // Minimum de avgVolumeDataMo parmi tous les clients de cette offre
            double minAvgTrafData = offerClients.stream()
                .filter(cr -> cr.getClient().getAvgVolumeDataMo() != null)
                .mapToDouble(cr -> cr.getClient().getAvgVolumeDataMo())
                .min().orElse(0.0);

            // ── Minimum AVG Traf Voice ─────────────────────────
            // Minimum de avgTrafTotal parmi tous les clients de cette offre
            double minAvgTrafVoice = offerClients.stream()
                .filter(cr -> cr.getClient().getAvgTrafTotal() != null)
                .mapToDouble(cr -> cr.getClient().getAvgTrafTotal())
                .min().orElse(0.0);

            // ── Minimum AVG Revenue ────────────────────────────
            // Minimum de avgRealRev parmi tous les clients de cette offre
            double minAvgRevenue = offerClients.stream()
                .filter(cr -> cr.getClient().getAvgRealRev() != null)
                .mapToDouble(cr -> cr.getClient().getAvgRealRev())
                .min().orElse(0.0);

            // ── Value Client majoritaire ───────────────────────
            // Low / Medium / High → prendre la valeur la plus fréquente
            String dominantValueClient = getMostFrequent(
                offerClients.stream()
                    .map(cr -> cr.getClient().getValueSegment())
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList())
            );

            // ── Activity majoritaire ───────────────────────────
            // Active / Inactive → prendre la valeur la plus fréquente
            String dominantActivity = getMostFrequent(
                offerClients.stream()
                    .map(cr -> cr.getClient().getFlagActivity())
                    .filter(Objects::nonNull)
                    .collect(Collectors.toList())
            );

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

            segmentationRepository.save(segmentation);

            log.info("Segmentation saved [offer={} | clients={} | value={} | activity={}]",
                offerName, offerClients.size(), dominantValueClient, dominantActivity);
        }
    }

    // =================================================
    // HELPER : valeur la plus fréquente dans une liste
    // =================================================
    private String getMostFrequent(List<String> values) {
        if (values == null || values.isEmpty()) return "Unknown";

        return values.stream()
            .collect(Collectors.groupingBy(v -> v, Collectors.counting()))
            .entrySet().stream()
            .max(Map.Entry.comparingByValue())
            .map(Map.Entry::getKey)
            .orElse("Unknown");
    }
}