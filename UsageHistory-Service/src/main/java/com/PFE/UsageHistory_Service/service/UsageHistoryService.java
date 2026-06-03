package com.PFE.UsageHistory_Service.service;

import com.PFE.UsageHistory_Service.entity.UsageHistory;
import com.PFE.UsageHistory_Service.repository.UsageHistoryRepository;

import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.time.LocalDate;
import java.util.List;

@Service
public class UsageHistoryService {

    private final UsageHistoryRepository usageHistoryRepository;

    public UsageHistoryService(UsageHistoryRepository usageHistoryRepository) {
        this.usageHistoryRepository = usageHistoryRepository;
    }

    public UsageHistory createUsageHistory(
            MultipartFile clientsFile,
            MultipartFile offersFile,
            Integer recommendationReference) {

        int totalClients = countLines(clientsFile);
        int totalOffers = countLines(offersFile);

        UsageHistory history = new UsageHistory();
        history.setRecommendationReference(recommendationReference);
        history.setDate(LocalDate.now());
        history.setTotalClients(totalClients);
        history.setTotalOffers(totalOffers);

        return usageHistoryRepository.save(history);
    }

    private int countLines(MultipartFile file) {
        try (InputStream is = file.getInputStream();
                Workbook workbook = new XSSFWorkbook(is)) {

            Sheet sheet = workbook.getSheetAt(0);

            int count = 0;

            boolean firstRow = true;

            for (Row row : sheet) {

                // Ignorer l'en-tête
                if (firstRow) {
                    firstRow = false;
                    continue;
                }

                if (row == null) {
                    continue;
                }

                boolean isEmpty = true;

                for (Cell cell : row) {
                    if (cell != null && cell.getCellType() != CellType.BLANK) {
                        isEmpty = false;
                        break;
                    }
                }

                if (!isEmpty) {
                    count++;
                }
            }

            return count;

        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la lecture du fichier Excel", e);
        }
    }

    public List<UsageHistory> getAllHistory() {
        return usageHistoryRepository.findAll();
    }

    public UsageHistory getHistoryById(Long id) {

        return usageHistoryRepository.findById(id)
                .orElse(null);
    }

    public List<UsageHistory> getByRecommendationReference(Integer recommendationReference) {
        return usageHistoryRepository
                .findByRecommendationReference(recommendationReference);
    }
}