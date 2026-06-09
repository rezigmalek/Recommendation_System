package com.PFE.Analytics_Service.event;

public class ClientDTO {

    private String clientReference;
    private String clientName;
    private String valueSegment;
    private int flagActivity;
    private Double avgRealRev;
    private Double potentialMaxRev;
    private Double tenure;
    private String tenure_segment;
    private Double pasivityO;
    private String clientPastOfferName;
    private Double clientPastOfferPrice;

    // Trafic
    private Double avgTrafOutVoiceOnnet;
    private Double avgTrafOutVoiceOffnet;
    private Double avgTrafOutVoiceInter;
    private Double avgTrafVoiceRoaming;
    private Double avgTrafTotal;
    private Double avgVolumeDataMo;

    // Revenus
    private Double revM1;
    private Double revM2;
    private Double revM3;

    public ClientDTO() {}

    public String getClientReference()              { return clientReference; }
    public void setClientReference(String v)        { this.clientReference = v; }
    public String getClientName()                   { return clientName; }
    public void setClientName(String v)             { this.clientName = v; }
    public String getValueSegment()                 { return valueSegment; }
    public void setValueSegment(String v)           { this.valueSegment = v; }
    public int getFlagActivity()                 { return flagActivity; }
    public void setFlagActivity(int v)           { this.flagActivity = v; }
    public Double getAvgRealRev()                   { return avgRealRev; }
    public void setAvgRealRev(Double v)             { this.avgRealRev = v; }
    public Double getPotentialMaxRev()              { return potentialMaxRev; }
    public void setPotentialMaxRev(Double v)        { this.potentialMaxRev = v; }
    public Double getTenure()                       { return tenure; }
    public void setTenure(Double v)                 { this.tenure = v; }
    public String getTenure_segment()               { return tenure_segment; }
    public void setTenure_segment(String v)         { this.tenure_segment = v; }
    public Double getPasivityO()                    { return pasivityO; }
    public void setPasivityO(Double v)              { this.pasivityO = v; }
    public String getClientPastOfferName()          { return clientPastOfferName; }
    public void setClientPastOfferName(String v)    { this.clientPastOfferName = v; }
    public Double getClientPastOfferPrice()         { return clientPastOfferPrice; }
    public void setClientPastOfferPrice(Double v)   { this.clientPastOfferPrice = v; }
    public Double getAvgTrafOutVoiceOnnet()         { return avgTrafOutVoiceOnnet; }
    public void setAvgTrafOutVoiceOnnet(Double v)   { this.avgTrafOutVoiceOnnet = v; }
    public Double getAvgTrafOutVoiceOffnet()        { return avgTrafOutVoiceOffnet; }
    public void setAvgTrafOutVoiceOffnet(Double v)  { this.avgTrafOutVoiceOffnet = v; }
    public Double getAvgTrafOutVoiceInter()         { return avgTrafOutVoiceInter; }
    public void setAvgTrafOutVoiceInter(Double v)   { this.avgTrafOutVoiceInter = v; }
    public Double getAvgTrafVoiceRoaming()          { return avgTrafVoiceRoaming; }
    public void setAvgTrafVoiceRoaming(Double v)    { this.avgTrafVoiceRoaming = v; }
    public Double getAvgTrafTotal()                 { return avgTrafTotal; }
    public void setAvgTrafTotal(Double v)           { this.avgTrafTotal = v; }
    public Double getAvgVolumeDataMo()              { return avgVolumeDataMo; }
    public void setAvgVolumeDataMo(Double v)        { this.avgVolumeDataMo = v; }
    public Double getRevM1()                        { return revM1; }
    public void setRevM1(Double v)                  { this.revM1 = v; }
    public Double getRevM2()                        { return revM2; }
    public void setRevM2(Double v)                  { this.revM2 = v; }
    public Double getRevM3()                        { return revM3; }
    public void setRevM3(Double v)                  { this.revM3 = v; }
}
