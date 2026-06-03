package com.PFE.Analytics_Service.event;

public class RecommendedOfferDTO {

    private Integer offerReference;
    private String offerName;
    private Double price;
    private Double score;
    private Double dataGeneral;
    private Double onnetVoiceUnlimited;
    private Double offnetVoiceUnlimited;
    private Double creditInternational;
    private Double creditOffnet;
    private Double creditOnnet;

    public RecommendedOfferDTO() {}

    public Integer getOfferReference()             { return offerReference; }
    public void setOfferReference(Integer v)       { this.offerReference = v; }
    public String getOfferName()                   { return offerName; }
    public void setOfferName(String v)             { this.offerName = v; }
    public Double getPrice()                       { return price; }
    public void setPrice(Double v)                 { this.price = v; }
    public Double getScore()                       { return score; }
    public void setScore(Double v)                 { this.score = v; }
    public Double getDataGeneral()                 { return dataGeneral; }
    public void setDataGeneral(Double v)           { this.dataGeneral = v; }
    public Double getOnnetVoiceUnlimited()         { return onnetVoiceUnlimited; }
    public void setOnnetVoiceUnlimited(Double v)   { this.onnetVoiceUnlimited = v; }
    public Double getOffnetVoiceUnlimited()        { return offnetVoiceUnlimited; }
    public void setOffnetVoiceUnlimited(Double v)  { this.offnetVoiceUnlimited = v; }
    public Double getCreditInternational()         { return creditInternational; }
    public void setCreditInternational(Double v)   { this.creditInternational = v; }
    public Double getCreditOffnet()                { return creditOffnet; }
    public void setCreditOffnet(Double v)          { this.creditOffnet = v; }
    public Double getCreditOnnet()                 { return creditOnnet; }
    public void setCreditOnnet(Double v)           { this.creditOnnet = v; }
}
