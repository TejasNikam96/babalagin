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
 * A notification for a logged-in profile user: interest received/accepted/
 * rejected, or payment-related updates.
 */
@Entity
@Table(name = "notifications")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Recipient registration code. */
    @Column(name = "registration_code")
    private String registrationCode;

    /** INTEREST_RECEIVED | INTEREST_ACCEPTED | INTEREST_REJECTED | PAYMENT */
    private String type;

    @Column(length = 500)
    private String message;

    /** For interest notifications: who triggered it. */
    @Column(name = "from_code")
    private String fromCode;

    @Column(name = "from_name")
    private String fromName;

    /** For INTEREST_RECEIVED: PENDING | ACCEPTED | REJECTED (drives accept/reject buttons). */
    private String status;

    @Column(name = "is_read")
    private boolean read = false;

    private LocalDateTime createdDate;

    @PrePersist
    protected void onCreate() {
        this.createdDate = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRegistrationCode() { return registrationCode; }
    public void setRegistrationCode(String registrationCode) { this.registrationCode = registrationCode; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getFromCode() { return fromCode; }
    public void setFromCode(String fromCode) { this.fromCode = fromCode; }

    public String getFromName() { return fromName; }
    public void setFromName(String fromName) { this.fromName = fromName; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public boolean isRead() { return read; }
    public void setRead(boolean read) { this.read = read; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
}
