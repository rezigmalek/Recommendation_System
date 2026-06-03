package com.PFE.Recommendation_Service.service;

import com.PFE.Recommendation_Service.entity.Client;
import com.PFE.Recommendation_Service.entity.ClientRecommendation;
import com.PFE.Recommendation_Service.entity.Recommendation;
import com.PFE.Recommendation_Service.entity.RecommendedOffer;
import com.PFE.Recommendation_Service.kafka.RecommendationProducer;
import com.PFE.Recommendation_Service.repository.RecommendationRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.bson.Document;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

@Service
public class RecommendationService {

    private final RecommendationRepository recommendationRepository;
    private final MongoTemplate mongoTemplate;
    private final RecommendationProducer recommendationProducer;

    public RecommendationService(
            RecommendationRepository recommendationRepository,
            MongoTemplate mongoTemplate,
            RecommendationProducer recommendationProducer) { // ← ajouter
        this.recommendationRepository = recommendationRepository;
        this.mongoTemplate = mongoTemplate;
        this.recommendationProducer = recommendationProducer; // ← ajouter
    }

    public int getNextSequence() {
        Query query = new Query(Criteria.where("_id").is("recommendation_seq"));
        Update update = new Update().inc("seq", 1);
        FindAndModifyOptions options = new FindAndModifyOptions().returnNew(true).upsert(true);
        Document result = mongoTemplate.findAndModify(
                query, update, options, Document.class, "database_sequences");
        return result.getInteger("seq");
    }

    // ================= CREATE =================

    public Recommendation createRecommendation(Recommendation recommendation) {
        recommendation.setRecommendationReference(getNextSequence());
        return recommendationRepository.save(recommendation);
    }

    // ================= GET ALL =================

    public List<Recommendation> getAllRecommendations() {
        return recommendationRepository.findAll();
    }

    // ================= GET BY REFERENCE =================

    public Recommendation getByRecommendationReference(Number reference) {
        System.out.println("REFERENCE = " + reference);
        return recommendationRepository.findByRecommendationReference(reference).orElse(null);
    }

    // ================= HELPERS =================

    private Double getDouble(Cell cell) {
        if (cell == null)
            return 0.0;
        try {
            if (cell.getCellType() == CellType.NUMERIC)
                return cell.getNumericCellValue();
            return Double.parseDouble(cell.getStringCellValue());
        } catch (Exception e) {
            return 0.0;
        }
    }

    private String getString(Cell cell) {
        if (cell == null)
            return "";
        try {
            if (cell.getCellType() == CellType.STRING)
                return cell.getStringCellValue();
            if (cell.getCellType() == CellType.NUMERIC)
                return String.valueOf((int) cell.getNumericCellValue());
            return "";
        } catch (Exception e) {
            return "";
        }
    }

    // ================= MAIN METHOD =================

    public Recommendation processFilesAndRecommend(
            MultipartFile clientsFile,
            MultipartFile offersFile,
            int topN) throws Exception {

        List<ClientRecommendation> clientsRecommendations = new ArrayList<>();

        // =========================
        // LIRE OFFERS
        // =========================

        InputStream offersStream = offersFile.getInputStream();
        Workbook offersWorkbook = new XSSFWorkbook(offersStream);
        Sheet offersSheet = offersWorkbook.getSheetAt(0);

        // Liste pour envoyer au modèle IA
        List<Map<String, Object>> offersList = new ArrayList<>();
        // Dictionnaire indexé par Offer_ID pour récupérer les infos complètes après
        Map<Integer, Map<String, Object>> offersById = new HashMap<>();

        for (int i = 1; i <= offersSheet.getLastRowNum(); i++) {
            Row row = offersSheet.getRow(i);
            if (row == null)
                continue;

            Map<String, Object> offer = new HashMap<>();
            offer.put("Offer_ID", getDouble(row.getCell(0)));
            offer.put("Offer_name", getString(row.getCell(1)));
            offer.put("price", getDouble(row.getCell(2)));
            offer.put("data general", getDouble(row.getCell(3)));
            offer.put("onnet_voice_unlimited", getDouble(row.getCell(4)));
            offer.put("offnet_voice_unlimited", getDouble(row.getCell(5)));
            offer.put("credit_international", getDouble(row.getCell(6)));
            offer.put("credit_offnet", getDouble(row.getCell(7)));
            offer.put("credit_onnet", getDouble(row.getCell(8)));

            offersList.add(offer);
            offersById.put(((Number) offer.get("Offer_ID")).intValue(), offer);
        }

        offersWorkbook.close();

        // =========================
        // LIRE CLIENTS
        // =========================

        InputStream clientsStream = clientsFile.getInputStream();
        Workbook workbook = new XSSFWorkbook(clientsStream);
        Sheet sheet = workbook.getSheetAt(0);

        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // =========================
        // LOOP CLIENTS
        // =========================

        for (int i = 1; i <= sheet.getLastRowNum(); i++) {

            Row row = sheet.getRow(i);
            if (row == null)
                continue;

            // -------------------------------------------------------
            // 1. Construire l'entité Client avec toutes les infos
            // -------------------------------------------------------

            Client client = new Client();
            client.setClientReference(getString(row.getCell(0)));
            client.setClientName(getString(row.getCell(1)));
            client.setClientPastOfferReference(getDouble(row.getCell(2)));
            client.setClientPastOfferName(getString(row.getCell(3)));
            client.setClientPastOfferPrice(getDouble(row.getCell(4)));
            client.setFlagActivity(getString(row.getCell(5)));
            client.setValueSegment(getString(row.getCell(6)));
            client.setPasivityO(getDouble(row.getCell(7)));
            client.setAvgRealRev(getDouble(row.getCell(8)));
            client.setPotentialMaxRev(getDouble(row.getCell(9)));

            client.setAvgTrafOutVoiceOnnet(getDouble(row.getCell(10)));
            client.setTrafOutVoiceOnnetM1(getDouble(row.getCell(11)));
            client.setTrafOutVoiceOnnetM2(getDouble(row.getCell(12)));
            client.setTrafOutVoiceOnnetM3(getDouble(row.getCell(13)));
            client.setTrafOutVoiceOnnetM4(getDouble(row.getCell(14)));
            client.setTrafOutVoiceOnnetM5(getDouble(row.getCell(15)));
            client.setTrafOutVoiceOnnetM6(getDouble(row.getCell(16)));

            client.setAvgTrafOutVoiceOffnet(getDouble(row.getCell(17)));
            client.setTrafOutVoiceOffnetM1(getDouble(row.getCell(18)));
            client.setTrafOutVoiceOffnetM2(getDouble(row.getCell(19)));
            client.setTrafOutVoiceOffnetM3(getDouble(row.getCell(20)));
            client.setTrafOutVoiceOffnetM4(getDouble(row.getCell(21)));
            client.setTrafOutVoiceOffnetM5(getDouble(row.getCell(22)));
            client.setTrafOutVoiceOffnetM6(getDouble(row.getCell(23)));

            client.setAvgTrafOutVoiceInter(getDouble(row.getCell(24)));
            client.setTrafOutVoiceInterM1(getDouble(row.getCell(25)));
            client.setTrafOutVoiceInterM2(getDouble(row.getCell(26)));
            client.setTrafOutVoiceInterM3(getDouble(row.getCell(27)));
            client.setTrafOutVoiceInterM4(getDouble(row.getCell(28)));
            client.setTrafOutVoiceInterM5(getDouble(row.getCell(29)));
            client.setTrafOutVoiceInterM6(getDouble(row.getCell(30)));

            client.setAvgTrafVoiceRoaming(getDouble(row.getCell(31)));
            client.setTrafVoiceRoamingM1(getDouble(row.getCell(32)));
            client.setTrafVoiceRoamingM2(getDouble(row.getCell(33)));
            client.setTrafVoiceRoamingM3(getDouble(row.getCell(34)));
            client.setTrafVoiceRoamingM4(getDouble(row.getCell(35)));
            client.setTrafVoiceRoamingM5(getDouble(row.getCell(36)));
            client.setTrafVoiceRoamingM6(getDouble(row.getCell(37)));

            client.setAvgTrafTotal(getDouble(row.getCell(38)));

            client.setSumTrafOutM1(getDouble(row.getCell(39)));
            client.setSumTrafOutM2(getDouble(row.getCell(40)));
            client.setSumTrafOutM3(getDouble(row.getCell(41)));
            client.setSumTrafOutM4(getDouble(row.getCell(42)));
            client.setSumTrafOutM5(getDouble(row.getCell(43)));
            client.setSumTrafOutM6(getDouble(row.getCell(44)));

            client.setAvgVolumeDataMo(getDouble(row.getCell(45)));
            client.setVolumeDataMoM1(getDouble(row.getCell(46)));
            client.setVolumeDataMoM2(getDouble(row.getCell(47)));
            client.setVolumeDataMoM3(getDouble(row.getCell(48)));
            client.setVolumeDataMoM4(getDouble(row.getCell(49)));
            client.setVolumeDataMoM5(getDouble(row.getCell(50)));
            client.setVolumeDataMoM6(getDouble(row.getCell(51)));

            client.setTrafOnnetRatio(getDouble(row.getCell(52)));
            client.setTrafOffnetRatio(getDouble(row.getCell(53)));
            client.setTrafInterRatio(getDouble(row.getCell(54)));

            client.setTrafOnnetRatioM1(getDouble(row.getCell(55)));
            client.setTrafOffnetRatioM1(getDouble(row.getCell(56)));
            client.setTrafInterRatioM1(getDouble(row.getCell(57)));

            client.setTrafOnnetRatioM2(getDouble(row.getCell(58)));
            client.setTrafOffnetRatioM2(getDouble(row.getCell(59)));
            client.setTrafInterRatioM2(getDouble(row.getCell(60)));

            client.setTrafOnnetRatioM3(getDouble(row.getCell(61)));
            client.setTrafOffnetRatioM3(getDouble(row.getCell(62)));
            client.setTrafInterRatioM3(getDouble(row.getCell(63)));

            client.setTrafOnnetRatioM4(getDouble(row.getCell(64)));
            client.setTrafOffnetRatioM4(getDouble(row.getCell(65)));
            client.setTrafInterRatioM4(getDouble(row.getCell(66)));

            client.setTrafOnnetRatioM5(getDouble(row.getCell(67)));
            client.setTrafOffnetRatioM5(getDouble(row.getCell(68)));
            client.setTrafInterRatioM5(getDouble(row.getCell(69)));

            client.setTrafOnnetRatioM6(getDouble(row.getCell(70)));
            client.setTrafOffnetRatioM6(getDouble(row.getCell(71)));
            client.setTrafInterRatioM6(getDouble(row.getCell(72)));

            client.setRevM1(getDouble(row.getCell(73)));
            client.setRevM2(getDouble(row.getCell(74)));
            client.setRevM3(getDouble(row.getCell(75)));
            client.setRevM4(getDouble(row.getCell(76)));
            client.setRevM5(getDouble(row.getCell(77)));
            client.setRevM6(getDouble(row.getCell(78)));

            client.setTop1Usage(getDouble(row.getCell(79)));
            client.setTop2Usage(getDouble(row.getCell(80)));
            client.setTop3Usage(getDouble(row.getCell(81)));

            client.setTop1Revenue(getDouble(row.getCell(82)));
            client.setTop2Revenue(getDouble(row.getCell(83)));
            client.setTop3Revenue(getDouble(row.getCell(84)));

            client.setTenure(getDouble(row.getCell(85)));

            // -------------------------------------------------------
            // 2. Construire la Map pour l'appel au modèle IA
            // -------------------------------------------------------

            Map<String, Object> clientMap = new HashMap<>();
            clientMap.put("Subs_Id", client.getClientReference());
            clientMap.put("Client_name", client.getClientName());
            clientMap.put("Client_past_offer_reference", client.getClientPastOfferReference());
            clientMap.put("Client_past_offer_name", client.getClientPastOfferName());
            clientMap.put("Client_past_offer_price", client.getClientPastOfferPrice());
            clientMap.put("Flag_Activity", client.getFlagActivity());
            clientMap.put("Value_Segment", client.getValueSegment());
            clientMap.put("Pasivity_O", client.getPasivityO());
            clientMap.put("AVG_REAL_REV", client.getAvgRealRev());
            clientMap.put("Potential_Max_REV", client.getPotentialMaxRev());
            clientMap.put("AVG_TRAF_OUT_VOICE_ONNET", client.getAvgTrafOutVoiceOnnet());
            clientMap.put("TRAF_OUT_VOICE_ONNET_M1", client.getTrafOutVoiceOnnetM1());
            clientMap.put("TRAF_OUT_VOICE_ONNET_M2", client.getTrafOutVoiceOnnetM2());
            clientMap.put("TRAF_OUT_VOICE_ONNET_M3", client.getTrafOutVoiceOnnetM3());
            clientMap.put("TRAF_OUT_VOICE_ONNET_M4", client.getTrafOutVoiceOnnetM4());
            clientMap.put("TRAF_OUT_VOICE_ONNET_M5", client.getTrafOutVoiceOnnetM5());
            clientMap.put("TRAF_OUT_VOICE_ONNET_M6", client.getTrafOutVoiceOnnetM6());
            clientMap.put("AVG_TRAF_OUT_VOICE_OFFNET", client.getAvgTrafOutVoiceOffnet());
            clientMap.put("TRAF_OUT_VOICE_OFFNET_M1", client.getTrafOutVoiceOffnetM1());
            clientMap.put("TRAF_OUT_VOICE_OFFNET_M2", client.getTrafOutVoiceOffnetM2());
            clientMap.put("TRAF_OUT_VOICE_OFFNET_M3", client.getTrafOutVoiceOffnetM3());
            clientMap.put("TRAF_OUT_VOICE_OFFNET_M4", client.getTrafOutVoiceOffnetM4());
            clientMap.put("TRAF_OUT_VOICE_OFFNET_M5", client.getTrafOutVoiceOffnetM5());
            clientMap.put("TRAF_OUT_VOICE_OFFNET_M6", client.getTrafOutVoiceOffnetM6());
            clientMap.put("AVG_TRAF_OUT_VOICE_INTER", client.getAvgTrafOutVoiceInter());
            clientMap.put("TRAF_OUT_VOICE_INTER_M1", client.getTrafOutVoiceInterM1());
            clientMap.put("TRAF_OUT_VOICE_INTER_M2", client.getTrafOutVoiceInterM2());
            clientMap.put("TRAF_OUT_VOICE_INTER_M3", client.getTrafOutVoiceInterM3());
            clientMap.put("TRAF_OUT_VOICE_INTER_M4", client.getTrafOutVoiceInterM4());
            clientMap.put("TRAF_OUT_VOICE_INTER_M5", client.getTrafOutVoiceInterM5());
            clientMap.put("TRAF_OUT_VOICE_INTER_M6", client.getTrafOutVoiceInterM6());
            clientMap.put("AVG_TRAF_VOICE_ROAMING", client.getAvgTrafVoiceRoaming());
            clientMap.put("TRAF_VOICE_ROAMING_M1", client.getTrafVoiceRoamingM1());
            clientMap.put("TRAF_VOICE_ROAMING_M2", client.getTrafVoiceRoamingM2());
            clientMap.put("TRAF_VOICE_ROAMING_M3", client.getTrafVoiceRoamingM3());
            clientMap.put("TRAF_VOICE_ROAMING_M4", client.getTrafVoiceRoamingM4());
            clientMap.put("TRAF_VOICE_ROAMING_M5", client.getTrafVoiceRoamingM5());
            clientMap.put("TRAF_VOICE_ROAMING_M6", client.getTrafVoiceRoamingM6());
            clientMap.put("AVG_TRAF_TOTAL", client.getAvgTrafTotal());
            clientMap.put("Sum_TRAF_OUT_M1", client.getSumTrafOutM1());
            clientMap.put("Sum_TRAF_OUT_M2", client.getSumTrafOutM2());
            clientMap.put("Sum_TRAF_OUT_M3", client.getSumTrafOutM3());
            clientMap.put("Sum_TRAF_OUT_M4", client.getSumTrafOutM4());
            clientMap.put("Sum_TRAF_OUT_M5", client.getSumTrafOutM5());
            clientMap.put("Sum_TRAF_OUT_M6", client.getSumTrafOutM6());
            clientMap.put("AVG_VOLUME_DATA_MO", client.getAvgVolumeDataMo());
            clientMap.put("VOLUME_DATA_MO_M1", client.getVolumeDataMoM1());
            clientMap.put("VOLUME_DATA_MO_M2", client.getVolumeDataMoM2());
            clientMap.put("VOLUME_DATA_MO_M3", client.getVolumeDataMoM3());
            clientMap.put("VOLUME_DATA_MO_M4", client.getVolumeDataMoM4());
            clientMap.put("VOLUME_DATA_MO_M5", client.getVolumeDataMoM5());
            clientMap.put("VOLUME_DATA_MO_M6", client.getVolumeDataMoM6());
            clientMap.put("TRAF_ONNET_RATIO", client.getTrafOnnetRatio());
            clientMap.put("TRAF_OFFNET_RATIO", client.getTrafOffnetRatio());
            clientMap.put("TRAF_INTER_RATIO", client.getTrafInterRatio());
            clientMap.put("TRAF_ONNET_RATIO_M1", client.getTrafOnnetRatioM1());
            clientMap.put("TRAF_OFFNET_RATIO_M1", client.getTrafOffnetRatioM1());
            clientMap.put("TRAF_INTER_RATIO_M1", client.getTrafInterRatioM1());
            clientMap.put("TRAF_ONNET_RATIO_M2", client.getTrafOnnetRatioM2());
            clientMap.put("TRAF_OFFNET_RATIO_M2", client.getTrafOffnetRatioM2());
            clientMap.put("TRAF_INTER_RATIO_M2", client.getTrafInterRatioM2());
            clientMap.put("TRAF_ONNET_RATIO_M3", client.getTrafOnnetRatioM3());
            clientMap.put("TRAF_OFFNET_RATIO_M3", client.getTrafOffnetRatioM3());
            clientMap.put("TRAF_INTER_RATIO_M3", client.getTrafInterRatioM3());
            clientMap.put("TRAF_ONNET_RATIO_M4", client.getTrafOnnetRatioM4());
            clientMap.put("TRAF_OFFNET_RATIO_M4", client.getTrafOffnetRatioM4());
            clientMap.put("TRAF_INTER_RATIO_M4", client.getTrafInterRatioM4());
            clientMap.put("TRAF_ONNET_RATIO_M5", client.getTrafOnnetRatioM5());
            clientMap.put("TRAF_OFFNET_RATIO_M5", client.getTrafOffnetRatioM5());
            clientMap.put("TRAF_INTER_RATIO_M5", client.getTrafInterRatioM5());
            clientMap.put("TRAF_ONNET_RATIO_M6", client.getTrafOnnetRatioM6());
            clientMap.put("TRAF_OFFNET_RATIO_M6", client.getTrafOffnetRatioM6());
            clientMap.put("TRAF_INTER_RATIO_M6", client.getTrafInterRatioM6());
            clientMap.put("REV_M1", client.getRevM1());
            clientMap.put("REV_M2", client.getRevM2());
            clientMap.put("REV_M3", client.getRevM3());
            clientMap.put("REV_M4", client.getRevM4());
            clientMap.put("REV_M5", client.getRevM5());
            clientMap.put("REV_M6", client.getRevM6());
            clientMap.put("top1_usage", client.getTop1Usage());
            clientMap.put("top2_usage", client.getTop2Usage());
            clientMap.put("top3_usage", client.getTop3Usage());
            clientMap.put("top1_revenue", client.getTop1Revenue());
            clientMap.put("top2_revenue", client.getTop2Revenue());
            clientMap.put("top3_revenue", client.getTop3Revenue());
            clientMap.put("Tenure", client.getTenure());

            // -------------------------------------------------------
            // 3. Appel au modèle IA
            // -------------------------------------------------------

            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("client", clientMap);
            requestBody.put("offers", offersList);

            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "http://localhost:5000/api/recommend",
                    entity,
                    Map.class);

            Map responseBody = response.getBody();
            List<Map<String, Object>> recommendations = (List<Map<String, Object>>) responseBody.get("recommendations");

            // -------------------------------------------------------
            // 4. Construire les RecommendedOffer avec toutes les infos
            // -------------------------------------------------------

            List<RecommendedOffer> offers = new ArrayList<>();

            for (int j = 0; j < Math.min(topN, recommendations.size()); j++) {

                Map<String, Object> rec = recommendations.get(j);
                int offerId = ((Number) rec.get("Offer_ID")).intValue();

                // Récupérer les données complètes depuis le dictionnaire
                Map<String, Object> fullOffer = offersById.get(offerId);

                RecommendedOffer offer = new RecommendedOffer();
                offer.setOfferReference(offerId);
                offer.setScore(((Number) rec.get("score")).doubleValue());

                if (fullOffer != null) {
                    offer.setOfferName((String) fullOffer.get("Offer_name"));
                    offer.setPrice(((Number) fullOffer.get("price")).doubleValue());
                    offer.setDataGeneral(((Number) fullOffer.get("data general")).doubleValue());
                    offer.setOnnetVoiceUnlimited(((Number) fullOffer.get("onnet_voice_unlimited")).doubleValue());
                    offer.setOffnetVoiceUnlimited(((Number) fullOffer.get("offnet_voice_unlimited")).doubleValue());
                    offer.setCreditInternational(((Number) fullOffer.get("credit_international")).doubleValue());
                    offer.setCreditOffnet(((Number) fullOffer.get("credit_offnet")).doubleValue());
                    offer.setCreditOnnet(((Number) fullOffer.get("credit_onnet")).doubleValue());
                }

                offers.add(offer);
            }

            // -------------------------------------------------------
            // 5. Créer ClientRecommendation avec client + offres complets
            // -------------------------------------------------------

            ClientRecommendation cr = new ClientRecommendation();
            cr.setClient(client); // objet Client complet
            cr.setRecommendedOffers(offers); // offres complètes

            clientsRecommendations.add(cr);
        }

        workbook.close();

        Recommendation recommendation = new Recommendation();
        recommendation.setRecommendationReference(getNextSequence());
        recommendation.setClientsRecommendations(clientsRecommendations);
        Recommendation saved = recommendationRepository.save(recommendation);
        recommendationProducer.publishRecommendationCreated(saved);
        return saved;
    }
}