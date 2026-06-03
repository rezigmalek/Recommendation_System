package com.PFE.Offer_Service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "offers")
public class Offer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "offer_reference", unique = true)
    private int offerReference;

    @Column(name = "offer_name")
    private String offerName;

    @Column(name = "price")
    private Double price;

    @Column(name = "data_general")
    private Double dataGeneral;

    @Column(name = "onnet_voice_unlimited")
    private Double onnetVoiceUnlimited;

    @Column(name = "offnet_voice_unlimited")
    private Double offnetVoiceUnlimited;

    @Column(name = "credit_international")
    private Double creditInternational;

    @Column(name = "credit_offnet")
    private Double creditOffnet;

    @Column(name = "credit_onnet")
    private Double creditOnnet;

    public Offer() {
    }

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

    public String getOfferName() {
        return offerName;
    }

    public void setOfferName(String offerName) {
        this.offerName = offerName;
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public Double getDataGeneral() {
        return dataGeneral;
    }

    public void setDataGeneral(Double dataGeneral) {
        this.dataGeneral = dataGeneral;
    }

    public Double getOnnetVoiceUnlimited() {
        return onnetVoiceUnlimited;
    }

    public void setOnnetVoiceUnlimited(Double onnetVoiceUnlimited) {
        this.onnetVoiceUnlimited = onnetVoiceUnlimited;
    }

    public Double getOffnetVoiceUnlimited() {
        return offnetVoiceUnlimited;
    }

    public void setOffnetVoiceUnlimited(Double offnetVoiceUnlimited) {
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