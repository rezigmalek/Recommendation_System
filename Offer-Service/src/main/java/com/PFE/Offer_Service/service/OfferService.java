package com.PFE.Offer_Service.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.PFE.Offer_Service.entity.Offer;
import com.PFE.Offer_Service.repository.OfferRepository;

@Service
public class OfferService {

    private final OfferRepository offerRepository;

    public OfferService(OfferRepository offerRepository) {
        this.offerRepository = offerRepository;
    }

    // ================= EXCEL IMPORT =================
    public List<Offer> importOffersFromExcel(MultipartFile file) {

        List<Offer> offers = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {

            Sheet sheet = workbook.getSheetAt(0);

            for (int i = 1; i < sheet.getPhysicalNumberOfRows(); i++) {

                Row row = sheet.getRow(i);

                if (row == null)
                    continue;

                Offer offer = new Offer();

                // ===== READ DATA =====
                offer.setOfferReference((int) row.getCell(0).getNumericCellValue());

                offer.setOfferName(row.getCell(1).getStringCellValue());

                offer.setPrice(row.getCell(2).getNumericCellValue());

                offer.setDataGeneral(row.getCell(3).getNumericCellValue());

                offer.setOnnetVoiceUnlimited(
                        (Double) row.getCell(4).getNumericCellValue());

                offer.setOffnetVoiceUnlimited(
                        (Double) row.getCell(5).getNumericCellValue());

                offer.setCreditInternational(row.getCell(6).getNumericCellValue());

                offer.setCreditOffnet(row.getCell(7).getNumericCellValue());

                offer.setCreditOnnet(row.getCell(8).getNumericCellValue());

                // ===== UPSERT LOGIC =====
                Optional<Offer> existing = offerRepository.findByOfferReference(offer.getOfferReference());

                if (existing.isPresent()) {

                    Offer o = existing.get();

                    o.setPrice(offer.getPrice());
                    o.setDataGeneral(offer.getDataGeneral());
                    o.setOnnetVoiceUnlimited(offer.getOnnetVoiceUnlimited());
                    o.setOffnetVoiceUnlimited(offer.getOffnetVoiceUnlimited());
                    o.setCreditInternational(offer.getCreditInternational());
                    o.setCreditOffnet(offer.getCreditOffnet());
                    o.setCreditOnnet(offer.getCreditOnnet());

                    offers.add(offerRepository.save(o));

                } else {
                    offers.add(offerRepository.save(offer));
                }
            }

        } catch (Exception e) {
            throw new RuntimeException("Error reading Offer Excel: " + e.getMessage());
        }

        return offers;
    }

    // ================= GET ALL OFFERS =================
    public List<Offer> getAllOffers() {
        return offerRepository.findAll();
    }
}