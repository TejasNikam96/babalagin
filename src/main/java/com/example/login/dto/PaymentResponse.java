package com.example.login.dto;

/**
 * Response body for {@code POST /api/payment/verify}.
 *
 * <p>The React slice merges this into its {@code paymentData} state and shows a
 * success message, so id/status/message are returned.</p>
 */
public class PaymentResponse {

    private Long id;
    private String registrationId;
    private String transactionId;
    private String status;
    private String message;

    public PaymentResponse() {
    }

    public PaymentResponse(Long id, String registrationId, String transactionId, String status, String message) {
        this.id = id;
        this.registrationId = registrationId;
        this.transactionId = transactionId;
        this.status = status;
        this.message = message;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRegistrationId() { return registrationId; }
    public void setRegistrationId(String registrationId) { this.registrationId = registrationId; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
