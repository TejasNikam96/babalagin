package com.example.login.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;

/**
 * A payment-verification submission for a registration.
 *
 * <p>{@code registrationId} is stored as a free-form string (not a hard foreign
 * key) because the React form may send a placeholder like {@code "temp-id"} when
 * the generated registration id wasn't threaded through. The uploaded screenshot
 * is written to disk and only its path/metadata is stored here.</p>
 */
@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "registration_id")
    private String registrationId;

    @Column(name = "transaction_id")
    private String transactionId;

    @Column(name = "upi_id")
    private String upiId;

    private String amount;

    /** Where the screenshot file is stored on disk. */
    @Column(name = "screenshot_path", length = 1000)
    private String screenshotPath;

    @Column(name = "screenshot_filename")
    private String screenshotFilename;

    @Column(name = "screenshot_content_type")
    private String screenshotContentType;

    /** "NEW" (registration) or "RENEWAL". Renewal payments reactivate the profile on verify. */
    @Column(name = "payment_type")
    private String paymentType;

    /** For renewal payments: number of months the renewal covers. */
    @Column(name = "renewal_months")
    private Integer renewalMonths;

    /** Verification status, e.g. PENDING_VERIFICATION / VERIFIED / REJECTED. */
    private String status;

    /** Optional admin note set when verifying/rejecting. */
    @Column(name = "status_note", length = 1000)
    private String statusNote;

    private LocalDateTime createdAt;

    /** Set whenever an admin changes the status. */
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "PENDING_VERIFICATION";
        }
        if (this.paymentType == null) {
            this.paymentType = "NEW";
        }
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRegistrationId() { return registrationId; }
    public void setRegistrationId(String registrationId) { this.registrationId = registrationId; }

    public String getTransactionId() { return transactionId; }
    public void setTransactionId(String transactionId) { this.transactionId = transactionId; }

    public String getUpiId() { return upiId; }
    public void setUpiId(String upiId) { this.upiId = upiId; }

    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }

    public String getScreenshotPath() { return screenshotPath; }
    public void setScreenshotPath(String screenshotPath) { this.screenshotPath = screenshotPath; }

    public String getScreenshotFilename() { return screenshotFilename; }
    public void setScreenshotFilename(String screenshotFilename) { this.screenshotFilename = screenshotFilename; }

    public String getScreenshotContentType() { return screenshotContentType; }
    public void setScreenshotContentType(String screenshotContentType) { this.screenshotContentType = screenshotContentType; }

    public String getPaymentType() { return paymentType; }
    public void setPaymentType(String paymentType) { this.paymentType = paymentType; }

    public Integer getRenewalMonths() { return renewalMonths; }
    public void setRenewalMonths(Integer renewalMonths) { this.renewalMonths = renewalMonths; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStatusNote() { return statusNote; }
    public void setStatusNote(String statusNote) { this.statusNote = statusNote; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
