package com.PFE.Recommendation_Service.entity;

public class Client {

    private String clientReference;
    private String clientName;
    private String contact;

    private Double clientPastOfferReference;
    private String clientPastOfferName;
    private Double clientPastOfferPrice;

    private String flagActivity;
    private String valueSegment;
    private Double pasivityO;
    private Double avgRealRev;
    private Double potentialMaxRev;

    private Double avgTrafOutVoiceOnnet;
    private Double trafOutVoiceOnnetM1;
    private Double trafOutVoiceOnnetM2;
    private Double trafOutVoiceOnnetM3;
    private Double trafOutVoiceOnnetM4;
    private Double trafOutVoiceOnnetM5;
    private Double trafOutVoiceOnnetM6;

    private Double avgTrafOutVoiceOffnet;
    private Double trafOutVoiceOffnetM1;
    private Double trafOutVoiceOffnetM2;
    private Double trafOutVoiceOffnetM3;
    private Double trafOutVoiceOffnetM4;
    private Double trafOutVoiceOffnetM5;
    private Double trafOutVoiceOffnetM6;

    private Double avgTrafOutVoiceInter;
    private Double trafOutVoiceInterM1;
    private Double trafOutVoiceInterM2;
    private Double trafOutVoiceInterM3;
    private Double trafOutVoiceInterM4;
    private Double trafOutVoiceInterM5;
    private Double trafOutVoiceInterM6;

    private Double avgTrafVoiceRoaming;
    private Double trafVoiceRoamingM1;
    private Double trafVoiceRoamingM2;
    private Double trafVoiceRoamingM3;
    private Double trafVoiceRoamingM4;
    private Double trafVoiceRoamingM5;
    private Double trafVoiceRoamingM6;

    private Double avgTrafTotal;

    private Double sumTrafOutM1;
    private Double sumTrafOutM2;
    private Double sumTrafOutM3;
    private Double sumTrafOutM4;
    private Double sumTrafOutM5;
    private Double sumTrafOutM6;

    private Double avgVolumeDataMo;

    private Double volumeDataMoM1;
    private Double volumeDataMoM2;
    private Double volumeDataMoM3;
    private Double volumeDataMoM4;
    private Double volumeDataMoM5;
    private Double volumeDataMoM6;

    private Double trafOnnetRatio;
    private Double trafOffnetRatio;
    private Double trafInterRatio;

    private Double trafOnnetRatioM1;
    private Double trafOffnetRatioM1;
    private Double trafInterRatioM1;

    private Double trafOnnetRatioM2;
    private Double trafOffnetRatioM2;
    private Double trafInterRatioM2;

    private Double trafOnnetRatioM3;
    private Double trafOffnetRatioM3;
    private Double trafInterRatioM3;

    private Double trafOnnetRatioM4;
    private Double trafOffnetRatioM4;
    private Double trafInterRatioM4;

    private Double trafOnnetRatioM5;
    private Double trafOffnetRatioM5;
    private Double trafInterRatioM5;

    private Double trafOnnetRatioM6;
    private Double trafOffnetRatioM6;
    private Double trafInterRatioM6;

    private Double revM1;
    private Double revM2;
    private Double revM3;
    private Double revM4;
    private Double revM5;
    private Double revM6;

    private Double top1Usage;
    private Double top2Usage;
    private Double top3Usage;

    private Double top1Revenue;
    private Double top2Revenue;
    private Double top3Revenue;

    private Double tenure;

    // ================= GETTERS & SETTERS =================

    public String getClientReference() {
        return clientReference;
    }

    public void setClientReference(String clientReference) {
        this.clientReference = clientReference;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public String getContact() {
        return contact;
    }

    public void setContact(String contact) {
        this.contact = contact;
    }

    public Double getClientPastOfferReference() {
        return clientPastOfferReference;
    }

    public void setClientPastOfferReference(Double clientPastOfferReference) {
        this.clientPastOfferReference = clientPastOfferReference;
    }

    public String getClientPastOfferName() {
        return clientPastOfferName;
    }

    public void setClientPastOfferName(String clientPastOfferName) {
        this.clientPastOfferName = clientPastOfferName;
    }

    public Double getClientPastOfferPrice() {
        return clientPastOfferPrice;
    }

    public void setClientPastOfferPrice(Double clientPastOfferPrice) {
        this.clientPastOfferPrice = clientPastOfferPrice;
    }

    public String getFlagActivity() {
        return flagActivity;
    }

    public void setFlagActivity(String flagActivity) {
        this.flagActivity = flagActivity;
    }

    public String getValueSegment() {
        return valueSegment;
    }

    public void setValueSegment(String valueSegment) {
        this.valueSegment = valueSegment;
    }

    public Double getPasivityO() {
        return pasivityO;
    }

    public void setPasivityO(Double pasivityO) {
        this.pasivityO = pasivityO;
    }

    public Double getAvgRealRev() {
        return avgRealRev;
    }

    public void setAvgRealRev(Double avgRealRev) {
        this.avgRealRev = avgRealRev;
    }

    public Double getPotentialMaxRev() {
        return potentialMaxRev;
    }

    public void setPotentialMaxRev(Double potentialMaxRev) {
        this.potentialMaxRev = potentialMaxRev;
    }

    public Double getAvgTrafOutVoiceOnnet() {
        return avgTrafOutVoiceOnnet;
    }

    public void setAvgTrafOutVoiceOnnet(Double avgTrafOutVoiceOnnet) {
        this.avgTrafOutVoiceOnnet = avgTrafOutVoiceOnnet;
    }

    public Double getTrafOutVoiceOnnetM1() {
        return trafOutVoiceOnnetM1;
    }

    public void setTrafOutVoiceOnnetM1(Double trafOutVoiceOnnetM1) {
        this.trafOutVoiceOnnetM1 = trafOutVoiceOnnetM1;
    }

    public Double getTrafOutVoiceOnnetM2() {
        return trafOutVoiceOnnetM2;
    }

    public void setTrafOutVoiceOnnetM2(Double trafOutVoiceOnnetM2) {
        this.trafOutVoiceOnnetM2 = trafOutVoiceOnnetM2;
    }

    public Double getTrafOutVoiceOnnetM3() {
        return trafOutVoiceOnnetM3;
    }

    public void setTrafOutVoiceOnnetM3(Double trafOutVoiceOnnetM3) {
        this.trafOutVoiceOnnetM3 = trafOutVoiceOnnetM3;
    }

    public Double getTrafOutVoiceOnnetM4() {
        return trafOutVoiceOnnetM4;
    }

    public void setTrafOutVoiceOnnetM4(Double trafOutVoiceOnnetM4) {
        this.trafOutVoiceOnnetM4 = trafOutVoiceOnnetM4;
    }

    public Double getTrafOutVoiceOnnetM5() {
        return trafOutVoiceOnnetM5;
    }

    public void setTrafOutVoiceOnnetM5(Double trafOutVoiceOnnetM5) {
        this.trafOutVoiceOnnetM5 = trafOutVoiceOnnetM5;
    }

    public Double getTrafOutVoiceOnnetM6() {
        return trafOutVoiceOnnetM6;
    }

    public void setTrafOutVoiceOnnetM6(Double trafOutVoiceOnnetM6) {
        this.trafOutVoiceOnnetM6 = trafOutVoiceOnnetM6;
    }

    public Double getAvgTrafOutVoiceOffnet() {
        return avgTrafOutVoiceOffnet;
    }

    public void setAvgTrafOutVoiceOffnet(Double avgTrafOutVoiceOffnet) {
        this.avgTrafOutVoiceOffnet = avgTrafOutVoiceOffnet;
    }

    public Double getTrafOutVoiceOffnetM1() {
        return trafOutVoiceOffnetM1;
    }

    public void setTrafOutVoiceOffnetM1(Double trafOutVoiceOffnetM1) {
        this.trafOutVoiceOffnetM1 = trafOutVoiceOffnetM1;
    }

    public Double getTrafOutVoiceOffnetM2() {
        return trafOutVoiceOffnetM2;
    }

    public void setTrafOutVoiceOffnetM2(Double trafOutVoiceOffnetM2) {
        this.trafOutVoiceOffnetM2 = trafOutVoiceOffnetM2;
    }

    public Double getTrafOutVoiceOffnetM3() {
        return trafOutVoiceOffnetM3;
    }

    public void setTrafOutVoiceOffnetM3(Double trafOutVoiceOffnetM3) {
        this.trafOutVoiceOffnetM3 = trafOutVoiceOffnetM3;
    }

    public Double getTrafOutVoiceOffnetM4() {
        return trafOutVoiceOffnetM4;
    }

    public void setTrafOutVoiceOffnetM4(Double trafOutVoiceOffnetM4) {
        this.trafOutVoiceOffnetM4 = trafOutVoiceOffnetM4;
    }

    public Double getTrafOutVoiceOffnetM5() {
        return trafOutVoiceOffnetM5;
    }

    public void setTrafOutVoiceOffnetM5(Double trafOutVoiceOffnetM5) {
        this.trafOutVoiceOffnetM5 = trafOutVoiceOffnetM5;
    }

    public Double getTrafOutVoiceOffnetM6() {
        return trafOutVoiceOffnetM6;
    }

    public void setTrafOutVoiceOffnetM6(Double trafOutVoiceOffnetM6) {
        this.trafOutVoiceOffnetM6 = trafOutVoiceOffnetM6;
    }

    public Double getAvgTrafOutVoiceInter() {
        return avgTrafOutVoiceInter;
    }

    public void setAvgTrafOutVoiceInter(Double avgTrafOutVoiceInter) {
        this.avgTrafOutVoiceInter = avgTrafOutVoiceInter;
    }

    public Double getTrafOutVoiceInterM1() {
        return trafOutVoiceInterM1;
    }

    public void setTrafOutVoiceInterM1(Double trafOutVoiceInterM1) {
        this.trafOutVoiceInterM1 = trafOutVoiceInterM1;
    }

    public Double getTrafOutVoiceInterM2() {
        return trafOutVoiceInterM2;
    }

    public void setTrafOutVoiceInterM2(Double trafOutVoiceInterM2) {
        this.trafOutVoiceInterM2 = trafOutVoiceInterM2;
    }

    public Double getTrafOutVoiceInterM3() {
        return trafOutVoiceInterM3;
    }

    public void setTrafOutVoiceInterM3(Double trafOutVoiceInterM3) {
        this.trafOutVoiceInterM3 = trafOutVoiceInterM3;
    }

    public Double getTrafOutVoiceInterM4() {
        return trafOutVoiceInterM4;
    }

    public void setTrafOutVoiceInterM4(Double trafOutVoiceInterM4) {
        this.trafOutVoiceInterM4 = trafOutVoiceInterM4;
    }

    public Double getTrafOutVoiceInterM5() {
        return trafOutVoiceInterM5;
    }

    public void setTrafOutVoiceInterM5(Double trafOutVoiceInterM5) {
        this.trafOutVoiceInterM5 = trafOutVoiceInterM5;
    }

    public Double getTrafOutVoiceInterM6() {
        return trafOutVoiceInterM6;
    }

    public void setTrafOutVoiceInterM6(Double trafOutVoiceInterM6) {
        this.trafOutVoiceInterM6 = trafOutVoiceInterM6;
    }

    public Double getAvgTrafVoiceRoaming() {
        return avgTrafVoiceRoaming;
    }

    public void setAvgTrafVoiceRoaming(Double avgTrafVoiceRoaming) {
        this.avgTrafVoiceRoaming = avgTrafVoiceRoaming;
    }

    public Double getTrafVoiceRoamingM1() {
        return trafVoiceRoamingM1;
    }

    public void setTrafVoiceRoamingM1(Double trafVoiceRoamingM1) {
        this.trafVoiceRoamingM1 = trafVoiceRoamingM1;
    }

    public Double getTrafVoiceRoamingM2() {
        return trafVoiceRoamingM2;
    }

    public void setTrafVoiceRoamingM2(Double trafVoiceRoamingM2) {
        this.trafVoiceRoamingM2 = trafVoiceRoamingM2;
    }

    public Double getTrafVoiceRoamingM3() {
        return trafVoiceRoamingM3;
    }

    public void setTrafVoiceRoamingM3(Double trafVoiceRoamingM3) {
        this.trafVoiceRoamingM3 = trafVoiceRoamingM3;
    }

    public Double getTrafVoiceRoamingM4() {
        return trafVoiceRoamingM4;
    }

    public void setTrafVoiceRoamingM4(Double trafVoiceRoamingM4) {
        this.trafVoiceRoamingM4 = trafVoiceRoamingM4;
    }

    public Double getTrafVoiceRoamingM5() {
        return trafVoiceRoamingM5;
    }

    public void setTrafVoiceRoamingM5(Double trafVoiceRoamingM5) {
        this.trafVoiceRoamingM5 = trafVoiceRoamingM5;
    }

    public Double getTrafVoiceRoamingM6() {
        return trafVoiceRoamingM6;
    }

    public void setTrafVoiceRoamingM6(Double trafVoiceRoamingM6) {
        this.trafVoiceRoamingM6 = trafVoiceRoamingM6;
    }

    public Double getAvgTrafTotal() {
        return avgTrafTotal;
    }

    public void setAvgTrafTotal(Double avgTrafTotal) {
        this.avgTrafTotal = avgTrafTotal;
    }

    public Double getSumTrafOutM1() {
        return sumTrafOutM1;
    }

    public void setSumTrafOutM1(Double sumTrafOutM1) {
        this.sumTrafOutM1 = sumTrafOutM1;
    }

    public Double getSumTrafOutM2() {
        return sumTrafOutM2;
    }

    public void setSumTrafOutM2(Double sumTrafOutM2) {
        this.sumTrafOutM2 = sumTrafOutM2;
    }

    public Double getSumTrafOutM3() {
        return sumTrafOutM3;
    }

    public void setSumTrafOutM3(Double sumTrafOutM3) {
        this.sumTrafOutM3 = sumTrafOutM3;
    }

    public Double getSumTrafOutM4() {
        return sumTrafOutM4;
    }

    public void setSumTrafOutM4(Double sumTrafOutM4) {
        this.sumTrafOutM4 = sumTrafOutM4;
    }

    public Double getSumTrafOutM5() {
        return sumTrafOutM5;
    }

    public void setSumTrafOutM5(Double sumTrafOutM5) {
        this.sumTrafOutM5 = sumTrafOutM5;
    }

    public Double getSumTrafOutM6() {
        return sumTrafOutM6;
    }

    public void setSumTrafOutM6(Double sumTrafOutM6) {
        this.sumTrafOutM6 = sumTrafOutM6;
    }

    public Double getAvgVolumeDataMo() {
        return avgVolumeDataMo;
    }

    public void setAvgVolumeDataMo(Double avgVolumeDataMo) {
        this.avgVolumeDataMo = avgVolumeDataMo;
    }

    public Double getVolumeDataMoM1() {
        return volumeDataMoM1;
    }

    public void setVolumeDataMoM1(Double volumeDataMoM1) {
        this.volumeDataMoM1 = volumeDataMoM1;
    }

    public Double getVolumeDataMoM2() {
        return volumeDataMoM2;
    }

    public void setVolumeDataMoM2(Double volumeDataMoM2) {
        this.volumeDataMoM2 = volumeDataMoM2;
    }

    public Double getVolumeDataMoM3() {
        return volumeDataMoM3;
    }

    public void setVolumeDataMoM3(Double volumeDataMoM3) {
        this.volumeDataMoM3 = volumeDataMoM3;
    }

    public Double getVolumeDataMoM4() {
        return volumeDataMoM4;
    }

    public void setVolumeDataMoM4(Double volumeDataMoM4) {
        this.volumeDataMoM4 = volumeDataMoM4;
    }

    public Double getVolumeDataMoM5() {
        return volumeDataMoM5;
    }

    public void setVolumeDataMoM5(Double volumeDataMoM5) {
        this.volumeDataMoM5 = volumeDataMoM5;
    }

    public Double getVolumeDataMoM6() {
        return volumeDataMoM6;
    }

    public void setVolumeDataMoM6(Double volumeDataMoM6) {
        this.volumeDataMoM6 = volumeDataMoM6;
    }

    public Double getTrafOnnetRatio() {
        return trafOnnetRatio;
    }

    public void setTrafOnnetRatio(Double trafOnnetRatio) {
        this.trafOnnetRatio = trafOnnetRatio;
    }

    public Double getTrafOffnetRatio() {
        return trafOffnetRatio;
    }

    public void setTrafOffnetRatio(Double trafOffnetRatio) {
        this.trafOffnetRatio = trafOffnetRatio;
    }

    public Double getTrafInterRatio() {
        return trafInterRatio;
    }

    public void setTrafInterRatio(Double trafInterRatio) {
        this.trafInterRatio = trafInterRatio;
    }

    public Double getTrafOnnetRatioM1() {
        return trafOnnetRatioM1;
    }

    public void setTrafOnnetRatioM1(Double trafOnnetRatioM1) {
        this.trafOnnetRatioM1 = trafOnnetRatioM1;
    }

    public Double getTrafOffnetRatioM1() {
        return trafOffnetRatioM1;
    }

    public void setTrafOffnetRatioM1(Double trafOffnetRatioM1) {
        this.trafOffnetRatioM1 = trafOffnetRatioM1;
    }

    public Double getTrafInterRatioM1() {
        return trafInterRatioM1;
    }

    public void setTrafInterRatioM1(Double trafInterRatioM1) {
        this.trafInterRatioM1 = trafInterRatioM1;
    }

    public Double getTrafOnnetRatioM2() {
        return trafOnnetRatioM2;
    }

    public void setTrafOnnetRatioM2(Double trafOnnetRatioM2) {
        this.trafOnnetRatioM2 = trafOnnetRatioM2;
    }

    public Double getTrafOffnetRatioM2() {
        return trafOffnetRatioM2;
    }

    public void setTrafOffnetRatioM2(Double trafOffnetRatioM2) {
        this.trafOffnetRatioM2 = trafOffnetRatioM2;
    }

    public Double getTrafInterRatioM2() {
        return trafInterRatioM2;
    }

    public void setTrafInterRatioM2(Double trafInterRatioM2) {
        this.trafInterRatioM2 = trafInterRatioM2;
    }

    public Double getTrafOnnetRatioM3() {
        return trafOnnetRatioM3;
    }

    public void setTrafOnnetRatioM3(Double trafOnnetRatioM3) {
        this.trafOnnetRatioM3 = trafOnnetRatioM3;
    }

    public Double getTrafOffnetRatioM3() {
        return trafOffnetRatioM3;
    }

    public void setTrafOffnetRatioM3(Double trafOffnetRatioM3) {
        this.trafOffnetRatioM3 = trafOffnetRatioM3;
    }

    public Double getTrafInterRatioM3() {
        return trafInterRatioM3;
    }

    public void setTrafInterRatioM3(Double trafInterRatioM3) {
        this.trafInterRatioM3 = trafInterRatioM3;
    }

    public Double getTrafOnnetRatioM4() {
        return trafOnnetRatioM4;
    }

    public void setTrafOnnetRatioM4(Double trafOnnetRatioM4) {
        this.trafOnnetRatioM4 = trafOnnetRatioM4;
    }

    public Double getTrafOffnetRatioM4() {
        return trafOffnetRatioM4;
    }

    public void setTrafOffnetRatioM4(Double trafOffnetRatioM4) {
        this.trafOffnetRatioM4 = trafOffnetRatioM4;
    }

    public Double getTrafInterRatioM4() {
        return trafInterRatioM4;
    }

    public void setTrafInterRatioM4(Double trafInterRatioM4) {
        this.trafInterRatioM4 = trafInterRatioM4;
    }

    public Double getTrafOnnetRatioM5() {
        return trafOnnetRatioM5;
    }

    public void setTrafOnnetRatioM5(Double trafOnnetRatioM5) {
        this.trafOnnetRatioM5 = trafOnnetRatioM5;
    }

    public Double getTrafOffnetRatioM5() {
        return trafOffnetRatioM5;
    }

    public void setTrafOffnetRatioM5(Double trafOffnetRatioM5) {
        this.trafOffnetRatioM5 = trafOffnetRatioM5;
    }

    public Double getTrafInterRatioM5() {
        return trafInterRatioM5;
    }

    public void setTrafInterRatioM5(Double trafInterRatioM5) {
        this.trafInterRatioM5 = trafInterRatioM5;
    }

    public Double getTrafOnnetRatioM6() {
        return trafOnnetRatioM6;
    }

    public void setTrafOnnetRatioM6(Double trafOnnetRatioM6) {
        this.trafOnnetRatioM6 = trafOnnetRatioM6;
    }

    public Double getTrafOffnetRatioM6() {
        return trafOffnetRatioM6;
    }

    public void setTrafOffnetRatioM6(Double trafOffnetRatioM6) {
        this.trafOffnetRatioM6 = trafOffnetRatioM6;
    }

    public Double getTrafInterRatioM6() {
        return trafInterRatioM6;
    }

    public void setTrafInterRatioM6(Double trafInterRatioM6) {
        this.trafInterRatioM6 = trafInterRatioM6;
    }

    public Double getRevM1() {
        return revM1;
    }

    public void setRevM1(Double revM1) {
        this.revM1 = revM1;
    }

    public Double getRevM2() {
        return revM2;
    }

    public void setRevM2(Double revM2) {
        this.revM2 = revM2;
    }

    public Double getRevM3() {
        return revM3;
    }

    public void setRevM3(Double revM3) {
        this.revM3 = revM3;
    }

    public Double getRevM4() {
        return revM4;
    }

    public void setRevM4(Double revM4) {
        this.revM4 = revM4;
    }

    public Double getRevM5() {
        return revM5;
    }

    public void setRevM5(Double revM5) {
        this.revM5 = revM5;
    }

    public Double getRevM6() {
        return revM6;
    }

    public void setRevM6(Double revM6) {
        this.revM6 = revM6;
    }

    public Double getTop1Usage() {
        return top1Usage;
    }

    public void setTop1Usage(Double top1Usage) {
        this.top1Usage = top1Usage;
    }

    public Double getTop2Usage() {
        return top2Usage;
    }

    public void setTop2Usage(Double top2Usage) {
        this.top2Usage = top2Usage;
    }

    public Double getTop3Usage() {
        return top3Usage;
    }

    public void setTop3Usage(Double top3Usage) {
        this.top3Usage = top3Usage;
    }

    public Double getTop1Revenue() {
        return top1Revenue;
    }

    public void setTop1Revenue(Double top1Revenue) {
        this.top1Revenue = top1Revenue;
    }

    public Double getTop2Revenue() {
        return top2Revenue;
    }

    public void setTop2Revenue(Double top2Revenue) {
        this.top2Revenue = top2Revenue;
    }

    public Double getTop3Revenue() {
        return top3Revenue;
    }

    public void setTop3Revenue(Double top3Revenue) {
        this.top3Revenue = top3Revenue;
    }

    public Double getTenure() {
        return tenure;
    }

    public void setTenure(Double tenure) {
        this.tenure = tenure;
    }
}