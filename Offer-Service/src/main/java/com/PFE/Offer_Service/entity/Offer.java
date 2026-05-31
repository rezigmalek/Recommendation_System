package com.PFE.Offer_Service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "offers")
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "offer_reference")
    private int offerReference;

    @Column(name = "price")
    private Double price;

    @Column(name = "data_general")
    private Double data_general;

    @Column(name = "onnet_voice_unlimited")
    private int onnetVoiceUnlimited;

    @Column(name = "offnet_voice_unlimited")
    private int offnetVoiceUnlimited;

    @Column(name = "credit_international")
    private Double creditInternational;

    @Column(name = "credit_offnet")
    private Double creditOffnet;

    @Column(name = "credit_onnet")
    private Double creditOnnet;

    public Offer() {
    }

    // ================= GETTERS & SETTERS =================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getOfferReference() {
        return offerReference;
    }

    public void setOfferReference(int offerReference) {
        this.offerReference = offerReference;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getData_general() {
        return data_general;
    }

    public void setData_general(Double data_general) {
        this.data_general = data_general;
    }

    public int getOnnetVoiceUnlimited() {
        return onnetVoiceUnlimited;
    }

    public void setOnnetVoiceUnlimited(int onnetVoiceUnlimited) {
        this.onnetVoiceUnlimited = onnetVoiceUnlimited;
    }

    public int getOffnetVoiceUnlimited() {
        return offnetVoiceUnlimited;
    }

    public void setOffnetVoiceUnlimited(int offnetVoiceUnlimited) {
        this.offnetVoiceUnlimited = offnetVoiceUnlimited;
    }

    public Double getCreditInternational() {
        return creditInternational;
    }

    public void setCreditInternational(Double creditInternational) {
        this.creditInternational = creditInternational;
    }

    public Double getCreditOffnet() {
        return creditOffnet;
    }

    public void setCreditOffnet(Double creditOffnet) {
        this.creditOffnet = creditOffnet;
    }

    public Double getCreditOnnet() {
        return creditOnnet;
    }

    public void setCreditOnnet(Double creditOnnet) {
        this.creditOnnet = creditOnnet;
    }
}