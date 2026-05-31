package com.PFE.Recommendation_Service.service;

import com.PFE.Recommendation_Service.entity.ClientRecommendation;
import com.PFE.Recommendation_Service.entity.Recommendation;
import com.PFE.Recommendation_Service.entity.RecommendedOffer;
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

        public RecommendationService(
                        RecommendationRepository recommendationRepository,
                        MongoTemplate mongoTemplate) {
                this.recommendationRepository = recommendationRepository;
                this.mongoTemplate = mongoTemplate;
        }

        public int getNextSequence() {

                Query query = new Query(
                                Criteria.where("_id")
                                                .is("recommendation_seq"));

                Update update = new Update().inc("seq", 1);

                FindAndModifyOptions options = new FindAndModifyOptions()
                                .returnNew(true)
                                .upsert(true);

                Document result = mongoTemplate.findAndModify(
                                query,
                                update,
                                options,
                                Document.class,
                                "database_sequences");

                return result.getInteger("seq");
        }

        // ================= CREATE =================

        public Recommendation createRecommendation(
                        Recommendation recommendation) {

                recommendation.setRecommendationReference(
                                getNextSequence());

                return recommendationRepository.save(
                                recommendation);
        }

        // ================= GET ALL =================

        public List<Recommendation> getAllRecommendations() {

                return recommendationRepository.findAll();
        }

        // ================= GET BY REFERENCE =================

        public Recommendation getByRecommendationReference(Number reference) {

                System.out.println("REFERENCE = " + reference);

                return recommendationRepository
                                .findByRecommendationReference(reference)
                                .orElse(null);
        }

        // ================= DELETE =================

        public void deleteRecommendation(
                        Number recommendationReference) {

                Recommendation recommendation = recommendationRepository
                                .findByRecommendationReference(
                                                recommendationReference)
                                .orElse(null);

                if (recommendation != null) {
                        recommendationRepository.delete(recommendation);
                }
        }

        // ================= MOOOODEEEEEEEEEELLLL ==================================

        private Double getDouble(Cell cell) {

                if (cell == null) {
                        return 0.0;
                }

                try {

                        if (cell.getCellType() == CellType.NUMERIC) {
                                return cell.getNumericCellValue();
                        }

                        return Double.parseDouble(
                                        cell.getStringCellValue());

                } catch (Exception e) {
                        return 0.0;
                }
        }

        private String getString(Cell cell) {

                if (cell == null) {
                        return "";
                }

                try {

                        if (cell.getCellType() == CellType.STRING) {
                                return cell.getStringCellValue();
                        }

                        if (cell.getCellType() == CellType.NUMERIC) {
                                return String.valueOf(
                                                (int) cell.getNumericCellValue());
                        }

                        return "";

                } catch (Exception e) {
                        return "";
                }
        }

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

                List<Map<String, Object>> offersList = new ArrayList<>();

                for (int i = 1; i <= offersSheet.getLastRowNum(); i++) {

                        Row row = offersSheet.getRow(i);
                        if (row == null)
                                continue;

                        Map<String, Object> offer = new HashMap<>();

                        offer.put("Offer_ID", getDouble(row.getCell(0)));
                        offer.put("price", getDouble(row.getCell(1)));
                        offer.put("data general", getDouble(row.getCell(2)));
                        offer.put("onnet_voice_unlimited", getDouble(row.getCell(3)));
                        offer.put("offnet_voice_unlimited", getDouble(row.getCell(4)));
                        offer.put("credit_international", getDouble(row.getCell(5)));
                        offer.put("credit_offnet", getDouble(row.getCell(6)));
                        offer.put("credit_onnet", getDouble(row.getCell(7)));

                        offersList.add(offer);
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

                        // =========================
                        // CLIENT OBJECT
                        // =========================

                        Map<String, Object> client = new HashMap<>();

                        client.put("Subs_Id", getString(row.getCell(0)));
                        client.put("Flag_Activity", getString(row.getCell(1)));
                        client.put("Value_Segment", getString(row.getCell(2)));
                        client.put("Pasivity_O", getDouble(row.getCell(3)));
                        client.put("AVG_REAL_REV", getDouble(row.getCell(4)));
                        client.put("Potential_Max_REV", getDouble(row.getCell(5)));

                        client.put("AVG_TRAF_OUT_VOICE_ONNET", getDouble(row.getCell(6)));
                        client.put("TRAF_OUT_VOICE_ONNET_M1", getDouble(row.getCell(7)));
                        client.put("TRAF_OUT_VOICE_ONNET_M2", getDouble(row.getCell(8)));
                        client.put("TRAF_OUT_VOICE_ONNET_M3", getDouble(row.getCell(9)));
                        client.put("TRAF_OUT_VOICE_ONNET_M4", getDouble(row.getCell(10)));
                        client.put("TRAF_OUT_VOICE_ONNET_M5", getDouble(row.getCell(11)));
                        client.put("TRAF_OUT_VOICE_ONNET_M6", getDouble(row.getCell(12)));

                        client.put("AVG_TRAF_OUT_VOICE_OFFNET", getDouble(row.getCell(13)));
                        client.put("TRAF_OUT_VOICE_OFFNET_M1", getDouble(row.getCell(14)));
                        client.put("TRAF_OUT_VOICE_OFFNET_M2", getDouble(row.getCell(15)));
                        client.put("TRAF_OUT_VOICE_OFFNET_M3", getDouble(row.getCell(16)));
                        client.put("TRAF_OUT_VOICE_OFFNET_M4", getDouble(row.getCell(17)));
                        client.put("TRAF_OUT_VOICE_OFFNET_M5", getDouble(row.getCell(18)));
                        client.put("TRAF_OUT_VOICE_OFFNET_M6", getDouble(row.getCell(19)));

                        client.put("AVG_TRAF_OUT_VOICE_INTER", getDouble(row.getCell(20)));
                        client.put("TRAF_OUT_VOICE_INTER_M1", getDouble(row.getCell(21)));
                        client.put("TRAF_OUT_VOICE_INTER_M2", getDouble(row.getCell(22)));
                        client.put("TRAF_OUT_VOICE_INTER_M3", getDouble(row.getCell(23)));
                        client.put("TRAF_OUT_VOICE_INTER_M4", getDouble(row.getCell(24)));
                        client.put("TRAF_OUT_VOICE_INTER_M5", getDouble(row.getCell(25)));
                        client.put("TRAF_OUT_VOICE_INTER_M6", getDouble(row.getCell(26)));

                        client.put("AVG_TRAF_VOICE_ROAMING", getDouble(row.getCell(27)));
                        client.put("TRAF_VOICE_ROAMING_M1", getDouble(row.getCell(28)));
                        client.put("TRAF_VOICE_ROAMING_M2", getDouble(row.getCell(29)));
                        client.put("TRAF_VOICE_ROAMING_M3", getDouble(row.getCell(30)));
                        client.put("TRAF_VOICE_ROAMING_M4", getDouble(row.getCell(31)));
                        client.put("TRAF_VOICE_ROAMING_M5", getDouble(row.getCell(32)));
                        client.put("TRAF_VOICE_ROAMING_M6", getDouble(row.getCell(33)));

                        client.put("AVG_TRAF_TOTAL", getDouble(row.getCell(34)));

                        client.put("Sum_TRAF_OUT_M1", getDouble(row.getCell(35)));
                        client.put("Sum_TRAF_OUT_M2", getDouble(row.getCell(36)));
                        client.put("Sum_TRAF_OUT_M3", getDouble(row.getCell(37)));
                        client.put("Sum_TRAF_OUT_M4", getDouble(row.getCell(38)));
                        client.put("Sum_TRAF_OUT_M5", getDouble(row.getCell(39)));
                        client.put("Sum_TRAF_OUT_M6", getDouble(row.getCell(40)));

                        client.put("AVG_VOLUME_DATA_MO", getDouble(row.getCell(41)));

                        client.put("VOLUME_DATA_MO_M1", getDouble(row.getCell(42)));
                        client.put("VOLUME_DATA_MO_M2", getDouble(row.getCell(43)));
                        client.put("VOLUME_DATA_MO_M3", getDouble(row.getCell(44)));
                        client.put("VOLUME_DATA_MO_M4", getDouble(row.getCell(45)));
                        client.put("VOLUME_DATA_MO_M5", getDouble(row.getCell(46)));
                        client.put("VOLUME_DATA_MO_M6", getDouble(row.getCell(47)));

                        client.put("TRAF_ONNET_RATIO", getDouble(row.getCell(48)));
                        client.put("TRAF_OFFNET_RATIO", getDouble(row.getCell(49)));
                        client.put("TRAF_INTER_RATIO", getDouble(row.getCell(50)));

                        client.put("TRAF_ONNET_RATIO_M1", getDouble(row.getCell(51)));
                        client.put("TRAF_OFFNET_RATIO_M1", getDouble(row.getCell(52)));
                        client.put("TRAF_INTER_RATIO_M1", getDouble(row.getCell(53)));

                        client.put("TRAF_ONNET_RATIO_M2", getDouble(row.getCell(54)));
                        client.put("TRAF_OFFNET_RATIO_M2", getDouble(row.getCell(55)));
                        client.put("TRAF_INTER_RATIO_M2", getDouble(row.getCell(56)));

                        client.put("TRAF_ONNET_RATIO_M3", getDouble(row.getCell(57)));
                        client.put("TRAF_OFFNET_RATIO_M3", getDouble(row.getCell(58)));
                        client.put("TRAF_INTER_RATIO_M3", getDouble(row.getCell(59)));

                        client.put("TRAF_ONNET_RATIO_M4", getDouble(row.getCell(60)));
                        client.put("TRAF_OFFNET_RATIO_M4", getDouble(row.getCell(61)));
                        client.put("TRAF_INTER_RATIO_M4", getDouble(row.getCell(62)));

                        client.put("TRAF_ONNET_RATIO_M5", getDouble(row.getCell(63)));
                        client.put("TRAF_OFFNET_RATIO_M5", getDouble(row.getCell(64)));
                        client.put("TRAF_INTER_RATIO_M5", getDouble(row.getCell(65)));

                        client.put("TRAF_ONNET_RATIO_M6", getDouble(row.getCell(66)));
                        client.put("TRAF_OFFNET_RATIO_M6", getDouble(row.getCell(67)));
                        client.put("TRAF_INTER_RATIO_M6", getDouble(row.getCell(68)));

                        client.put("REV_M1", getDouble(row.getCell(69)));
                        client.put("REV_M2", getDouble(row.getCell(70)));
                        client.put("REV_M3", getDouble(row.getCell(71)));
                        client.put("REV_M4", getDouble(row.getCell(72)));
                        client.put("REV_M5", getDouble(row.getCell(73)));
                        client.put("REV_M6", getDouble(row.getCell(74)));

                        client.put("top1_usage", getDouble(row.getCell(75)));
                        client.put("top2_usage", getDouble(row.getCell(76)));
                        client.put("top3_usage", getDouble(row.getCell(77)));

                        client.put("top1_revenue", getDouble(row.getCell(78)));
                        client.put("top2_revenue", getDouble(row.getCell(79)));
                        client.put("top3_revenue", getDouble(row.getCell(80)));

                        client.put("Tenure", getDouble(row.getCell(81)));

                        // =========================
                        // FINAL REQUEST BODY (IMPORTANT FIX)
                        // =========================

                        Map<String, Object> requestBody = new HashMap<>();
                        requestBody.put("client", client);
                        requestBody.put("offers", offersList);

                        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(requestBody, headers);

                        ResponseEntity<Map> response = restTemplate.postForEntity(
                                        "http://localhost:5000/api/recommend",
                                        entity,
                                        Map.class);

                        Map responseBody = response.getBody();

                        List<Map<String, Object>> recommendations = (List<Map<String, Object>>) responseBody
                                        .get("recommendations");

                        List<RecommendedOffer> offers = new ArrayList<>();

                        for (int j = 0; j < Math.min(topN, recommendations.size()); j++) {

                                Map<String, Object> rec = recommendations.get(j);

                                RecommendedOffer offer = new RecommendedOffer();

                                offer.setOfferReference(((Number) rec.get("Offer_ID")).intValue());
                                offer.setScore(((Number) rec.get("score")).doubleValue());

                                offers.add(offer);
                        }

                        ClientRecommendation cr = new ClientRecommendation();
                        cr.setClientReference(Integer.parseInt(getString(row.getCell(0))));
                        cr.setRecommendedOffers(offers);

                        clientsRecommendations.add(cr);
                }

                workbook.close();

                Recommendation recommendation = new Recommendation();
                recommendation.setRecommendationReference(getNextSequence());
                recommendation.setClientsRecommendations(clientsRecommendations);

                return recommendationRepository.save(recommendation);
        }

}