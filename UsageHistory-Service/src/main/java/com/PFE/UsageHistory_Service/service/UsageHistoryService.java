package com.PFE.UsageHistory_Service.service;

import com.PFE.UsageHistory_Service.entity.UsageHistory;
import com.PFE.UsageHistory_Service.repository.UsageHistoryRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class UsageHistoryService {

    private final UsageHistoryRepository usageHistoryRepository;

    public UsageHistoryService(UsageHistoryRepository usageHistoryRepository) {
        this.usageHistoryRepository = usageHistoryRepository;
    }

    public UsageHistory createHistory(UsageHistory usageHistory) {

        usageHistory.setDate(LocalDate.now());

        return usageHistoryRepository.save(usageHistory);
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