package com.example.login.dto;

import com.example.login.entity.Registration;

/**
 * Admin "Profiles" row: the full registration plus its current payment status.
 */
public class AdminProfileView {

    private Registration registration;
    private String paymentStatus;

    public AdminProfileView(Registration registration, String paymentStatus) {
        this.registration = registration;
        this.paymentStatus = paymentStatus;
    }

    public Registration getRegistration() { return registration; }
    public String getPaymentStatus() { return paymentStatus; }
}
