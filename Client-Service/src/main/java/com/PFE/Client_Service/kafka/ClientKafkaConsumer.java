package com.PFE.Client_Service.kafka;

import com.PFE.Client_Service.entity.Client;
import com.PFE.Client_Service.event.ClientDTO;
import com.PFE.Client_Service.event.ClientRecommendationDTO;
import com.PFE.Client_Service.event.RecommendationCreatedEvent;
import com.PFE.Client_Service.repository.ClientRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Component
public class ClientKafkaConsumer {

    private static final Logger log = LoggerFactory.getLogger(ClientKafkaConsumer.class);

    private final ClientRepository clientRepository;

    public ClientKafkaConsumer(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Transactional
    @KafkaListener(topics = "recommendation.created", groupId = "client-service", containerFactory = "kafkaListenerContainerFactory")
    public void onRecommendationCreated(RecommendationCreatedEvent event) {
        
        if (event == null) {
            System.err.println("ERROR: received null event — désérialisation échouée");
            return;
        }

        System.out.println("CONSUMER CALLED - eventId: " + event.getEventId());

        if (event.getRecommendation() == null) {
            System.err.println("ERROR: recommendation is NULL");
            return;
        }

        System.out.println("clients count: " +
                event.getRecommendation().getClientsRecommendations().size());

        log.info("Client-Service received event [id={}]", event.getEventId());

        List<ClientRecommendationDTO> clientRecommendations = event.getRecommendation().getClientsRecommendations();

        for (ClientRecommendationDTO cr : clientRecommendations) {

            ClientDTO dto = cr.getClient();

            Integer clientRef = Integer.parseInt(dto.getClientReference());

            Client client = clientRepository
                    .findByClientReference(clientRef)
                    .orElse(new Client());

            client.setClientReference(clientRef);
            client.setFull_name(dto.getClientName());
            client.setContact(dto.getContact());
            client.setValueSegment(dto.getValueSegment());
            client.setClientPastOfferName(dto.getClientPastOfferName());
            client.setClientPastOfferPrice(dto.getClientPastOfferPrice());
            client.setClientPastOfferReference(dto.getClientPastOfferReference());
            client.setFlag_activity(dto.getFlagActivity());

            if (dto.getTenure() != null) {
                client.setTenure(dto.getTenure().intValue());
            }

            client.setAvg_traf_out_voice_onnet(dto.getAvgTrafOutVoiceOnnet());
            client.setAvg_traf_out_voice_offnet(dto.getAvgTrafOutVoiceOffnet());
            client.setAvg_traf_out_voice_inter(dto.getAvgTrafOutVoiceInter());
            client.setAvg_traf_out_voice_roaming(dto.getAvgTrafVoiceRoaming());
            client.setAvg_traf_total(dto.getAvgTrafTotal());
            client.setAvg_volume_data_mo(dto.getAvgVolumeDataMo());

            client.setRev_m1(dto.getRevM1());
            client.setRev_m2(dto.getRevM2());
            client.setRev_m3(dto.getRevM3());

            client.setAvg_real_rev(dto.getAvgRealRev());
            client.setPotential_max_rev(dto.getPotentialMaxRev());

            clientRepository.save(client);

            log.info("Client saved/updated [ref={}]", clientRef);
        }
    }
}