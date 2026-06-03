package com.PFE.Offer_Service.kafka;

import com.PFE.Offer_Service.entity.Offer;
import com.PFE.Offer_Service.event.ClientRecommendationDTO;
import com.PFE.Offer_Service.event.RecommendationCreatedEvent;
import com.PFE.Offer_Service.event.RecommendedOfferDTO;
import com.PFE.Offer_Service.repository.OfferRepository;

import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OfferKafkaConsumer {

    private final OfferRepository offerRepository;

    public OfferKafkaConsumer(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    @Transactional
    @KafkaListener(
            topics = "recommendation.created",
            groupId = "offer-service",
            containerFactory = "kafkaListenerContainerFactory")
    public void consume(RecommendationCreatedEvent event) {

        if (event == null
                || event.getRecommendation() == null
                || event.getRecommendation().getClientsRecommendations() == null) {
            return;
        }

        System.out.println("Recommendation reçue : "
                + event.getEventId());

        for (ClientRecommendationDTO clientRecommendation :
                event.getRecommendation().getClientsRecommendations()) {

            if (clientRecommendation.getRecommendedOffers() == null)
                continue;

            for (RecommendedOfferDTO dto :
                    clientRecommendation.getRecommendedOffers()) {

                Offer offer = offerRepository
                        .findByOfferReference(dto.getOfferReference())
                        .orElse(new Offer());

                offer.setOfferReference(dto.getOfferReference());
                offer.setOfferName(dto.getOfferName());
                offer.setPrice(dto.getPrice());
                offer.setDataGeneral(dto.getDataGeneral());
                offer.setOnnetVoiceUnlimited(dto.getOnnetVoiceUnlimited());
                offer.setOffnetVoiceUnlimited(dto.getOffnetVoiceUnlimited());
                offer.setCreditInternational(dto.getCreditInternational());
                offer.setCreditOffnet(dto.getCreditOffnet());
                offer.setCreditOnnet(dto.getCreditOnnet());

                offerRepository.save(offer);

                System.out.println(
                        "Offre sauvegardée : "
                                + dto.getOfferReference()
                                + " - "
                                + dto.getOfferName());
            }
        }
    }
}