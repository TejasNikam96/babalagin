package com.example.login.service;

import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.example.login.entity.Payment;

/** Business operations for payment verifications. */
public interface PaymentService {

    /**
     * Stores a payment verification (persisting the screenshot to disk) and
     * returns the saved entity.
     */
    Payment verifyPayment(String registrationId, String transactionId, String upiId,
                          String amount, MultipartFile screenshot,
                          String paymentType, Integer renewalMonths);

    Payment getById(Long id);

    List<Payment> getAll();

    /** All payments submitted for a given registration code/id. */
    List<Payment> getByRegistrationId(String registrationId);

    /** Admin action: set a payment's verification status (and optional note). */
    Payment updateStatus(Long id, String status, String note);

    /** Admin: set the payment status for a registration (updates latest, or creates one). */
    Payment setStatusByRegistrationCode(String registrationCode, String status);
}
