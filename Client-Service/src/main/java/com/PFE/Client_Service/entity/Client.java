package com.PFE.Client_Service.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "clients")
public class Client {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "client_reference")
    private Integer clientReference;

    @Column(name = "full_name")
    private String full_name;

    @Column(name = "contact")
    private String contact;

    @Column(name = "value_segment")
    private String valueSegment;

    @Column(name = "client_past_offer_name")
    private String clientPastOfferName;

    @Column(name = "client_past_offer_price")
    private Double clientPastOfferPrice;

    @Column(name = "client_past_offer_reference")
    private Double clientPastOfferReference;

    @Column(name = "flag_activity")
    private String flag_activity;

    @Column(name = "tenure")
    private Integer tenure;

    @Column(name = "avg_traf_out_voice_onnet")
    private Double avg_traf_out_voice_onnet;

    @Column(name = "avg_traf_out_voice_offnet")
    private Double avg_traf_out_voice_offnet;

    @Column(name = "avg_traf_out_voice_inter")
    private Double avg_traf_out_voice_inter;

    @Column(name = "avg_traf_out_voice_roaming")
    private Double avg_traf_out_voice_roaming;

    @Column(name = "avg_traf_total")
    private Double avg_traf_total;

    @Column(name = "avg_volume_data_mo")
    private Double avg_volume_data_mo;

    @Column(name = "rev_m3")
    private Double rev_m3;

    @Column(name = "rev_m2")
    private Double rev_m2;

    @Column(name = "rev_m1")
    private Double rev_m1;

    @Column(name = "avg_real_rev")
    private Double avg_real_rev;

    @Column(name = "potential_max_rev")
    private Double potential_max_rev;

    public Client() {}

    public int getId() {
    return id;
}

public void setId(int id) {
    this.id = id;
}

public Integer getClientReference() {
    return clientReference;
}

public void setClientReference(Integer clientReference) {
    this.clientReference = clientReference;
}

public String getFull_name() {
    return full_name;
}

public void setFull_name(String full_name) {
    this.full_name = full_name;
}

public String getContact() {
    return contact;
}

public void setContact(String contact) {
    this.contact = contact;
}

public String getValueSegment() {
    return valueSegment;
}

public void setValueSegment(String valueSegment) {
    this.valueSegment = valueSegment;
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

public Double getClientPastOfferReference() {
    return clientPastOfferReference;
}

public void setClientPastOfferReference(Double clientPastOfferReference) {
    this.clientPastOfferReference = clientPastOfferReference;
}

public String getFlag_activity() {
    return flag_activity;
}

public void setFlag_activity(String flag_activity) {
    this.flag_activity = flag_activity;
}

public Integer getTenure() {
    return tenure;
}

public void setTenure(Integer tenure) {
    this.tenure = tenure;
}

public Double getAvg_traf_out_voice_onnet() {
    return avg_traf_out_voice_onnet;
}

public void setAvg_traf_out_voice_onnet(Double avg_traf_out_voice_onnet) {
    this.avg_traf_out_voice_onnet = avg_traf_out_voice_onnet;
}

public Double getAvg_traf_out_voice_offnet() {
    return avg_traf_out_voice_offnet;
}

public void setAvg_traf_out_voice_offnet(Double avg_traf_out_voice_offnet) {
    this.avg_traf_out_voice_offnet = avg_traf_out_voice_offnet;
}

public Double getAvg_traf_out_voice_inter() {
    return avg_traf_out_voice_inter;
}

public void setAvg_traf_out_voice_inter(Double avg_traf_out_voice_inter) {
    this.avg_traf_out_voice_inter = avg_traf_out_voice_inter;
}

public Double getAvg_traf_out_voice_roaming() {
    return avg_traf_out_voice_roaming;
}

public void setAvg_traf_out_voice_roaming(Double avg_traf_out_voice_roaming) {
    this.avg_traf_out_voice_roaming = avg_traf_out_voice_roaming;
}

public Double getAvg_traf_total() {
    return avg_traf_total;
}

public void setAvg_traf_total(Double avg_traf_total) {
    this.avg_traf_total = avg_traf_total;
}

public Double getAvg_volume_data_mo() {
    return avg_volume_data_mo;
}

public void setAvg_volume_data_mo(Double avg_volume_data_mo) {
    this.avg_volume_data_mo = avg_volume_data_mo;
}

public Double getRev_m3() {
    return rev_m3;
}

public void setRev_m3(Double rev_m3) {
    this.rev_m3 = rev_m3;
}

public Double getRev_m2() {
    return rev_m2;
}

public void setRev_m2(Double rev_m2) {
    this.rev_m2 = rev_m2;
}

public Double getRev_m1() {
    return rev_m1;
}

public void setRev_m1(Double rev_m1) {
    this.rev_m1 = rev_m1;
}

public Double getAvg_real_rev() {
    return avg_real_rev;
}

public void setAvg_real_rev(Double avg_real_rev) {
    this.avg_real_rev = avg_real_rev;
}

public Double getPotential_max_rev() {
    return potential_max_rev;
}

public void setPotential_max_rev(Double potential_max_rev) {
    this.potential_max_rev = potential_max_rev;
}
}