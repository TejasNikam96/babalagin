package com.example.login.dto;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;

/**
 * Request body for the admin endpoint
 * {@code PUT /api/payment/{id}/status}.
 */
public class PaymentStatusUpdateRequest {

    @NotBlank(message = "status is required")
    @Pattern(
        regexp = "VERIFIED|REJECTED|PENDING_VERIFICATION",
        message = "status must be one of VERIFIED, REJECTED, PENDING_VERIFICATION")
    private String status;

    /** Optional note explaining the decision. */
    private String note;

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNote() { return note; }
    public void setNote(String note) { this.note = note; }
}
