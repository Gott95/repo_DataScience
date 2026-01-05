package com.example.churnfeature.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class ChurnRequestDTO {

    private Integer tenure;

    @JsonProperty("usage_time")
    private Double usageTime;

    @JsonProperty("login_frequency")
    private Double loginFrequency;

    @JsonProperty("total_spend")
    private Double totalSpend;

    @JsonProperty("contract_type")
    private String contractType;

    @JsonProperty("subscription_type")
    private String subscriptionType;

    @JsonProperty("payment_record")
    private String paymentRecord;

    public ChurnRequestDTO() {
    }

    public Integer getTenure() {
        return tenure;
    }

    public void setTenure(Integer tenure) {
        this.tenure = tenure;
    }

    public Double getUsageTime() {
        return usageTime;
    }

    public void setUsageTime(Double usageTime) {
        this.usageTime = usageTime;
    }

    public Double getLoginFrequency() {
        return loginFrequency;
    }

    public void setLoginFrequency(Double loginFrequency) {
        this.loginFrequency = loginFrequency;
    }

    public Double getTotalSpend() {
        return totalSpend;
    }

    public void setTotalSpend(Double totalSpend) {
        this.totalSpend = totalSpend;
    }

    public String getContractType() {
        return contractType;
    }

    public void setContractType(String contractType) {
        this.contractType = contractType;
    }

    public String getSubscriptionType() {
        return subscriptionType;
    }

    public void setSubscriptionType(String subscriptionType) {
        this.subscriptionType = subscriptionType;
    }

    public String getPaymentRecord() {
        return paymentRecord;
    }

    public void setPaymentRecord(String paymentRecord) {
        this.paymentRecord = paymentRecord;
    }
}
