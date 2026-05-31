package com.PFE.UsageHistory_Service.repository;

import com.PFE.UsageHistory_Service.entity.UsageHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UsageHistoryRepository extends JpaRepository<UsageHistory, Long> {

    List<UsageHistory> findByRecommendationReference(Integer recommendationReference);

}