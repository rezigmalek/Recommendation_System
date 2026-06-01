package com.PFE.Recommendation_Service.entity;

public class RecommendedOffer {

    private Integer offerReference;
    private String offerName;
    private Double price;

    private Double dataGeneral;
    private Double onnetVoiceUnlimited;
    private Double offnetVoiceUnlimited;
    private Double creditInternational;
    private Double creditOffnet;
    private Double creditOnnet;

    private Double score;

    public RecommendedOffer() {}

    // ===== GETTERS & SETTERS =====

    public Integer getOfferReference() {
        return offerReference;
    }

    public void setOfferReference(Integer offerReference) {
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

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }
}