package com.PFE.Offer_Service.repository;

import com.PFE.Offer_Service.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OfferRepository extends JpaRepository<Offer, Long> {

    Optional<Offer> findByOfferReference(int offerReference);

}