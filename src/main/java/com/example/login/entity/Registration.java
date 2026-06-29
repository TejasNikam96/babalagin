package com.example.login.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.PreUpdate;
import javax.persistence.Table;

/**
 * A complete matrimonial enroll-form submission, persisted as one row.
 *
 * <p>The six form steps are stored as {@code @Embedded} value objects, so all
 * their fields become columns on the {@code registrations} table.</p>
 */
@Entity
@Table(name = "registrations")
public class Registration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Human-friendly login code, e.g. REG00001. Generated after the id is known. */
    @Column(name = "registration_code", unique = true)
    private String registrationCode;

    @Embedded
    private Personal personal;

    @Embedded
    private Horoscope horoscope;

    @Embedded
    private Education education;

    @Embedded
    private Address address;

    @Embedded
    private Family family;

    @Embedded
    private Expectation expectation;

    private LocalDateTime createdAt;

    /** Date the row was inserted. */
    @Column(name = "created_date")
    private LocalDateTime createdDate;

    /** Date the row was last changed. */
    @Column(name = "updated_date")
    private LocalDateTime updatedDate;

    /** Active flag: 'Y' (default) or 'N'. */
    @Column(name = "is_active", length = 1)
    private String isActive = "Y";

    /** Success-story flag: 'Y' or 'N' (default). */
    @Column(name = "success_story", length = 1)
    private String successStory = "N";

    /** Linked partner's registration code/id. */
    @Column(name = "partner_id", length = 20)
    private String partnerId;

    /** When the current renewal expires (set when an admin verifies a RENEWAL payment). */
    @Column(name = "renewed_until")
    private LocalDateTime renewedUntil;

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.createdDate = now;
        this.updatedDate = now;
        if (this.isActive == null) this.isActive = "Y";
        if (this.successStory == null) this.successStory = "N";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedDate = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRegistrationCode() { return registrationCode; }
    public void setRegistrationCode(String registrationCode) { this.registrationCode = registrationCode; }

    public Personal getPersonal() { return personal; }
    public void setPersonal(Personal personal) { this.personal = personal; }

    public Horoscope getHoroscope() { return horoscope; }
    public void setHoroscope(Horoscope horoscope) { this.horoscope = horoscope; }

    public Education getEducation() { return education; }
    public void setEducation(Education education) { this.education = education; }

    public Address getAddress() { return address; }
    public void setAddress(Address address) { this.address = address; }

    public Family getFamily() { return family; }
    public void setFamily(Family family) { this.family = family; }

    public Expectation getExpectation() { return expectation; }
    public void setExpectation(Expectation expectation) { this.expectation = expectation; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }

    public String getIsActive() { return isActive; }
    public void setIsActive(String isActive) { this.isActive = isActive; }

    public String getSuccessStory() { return successStory; }
    public void setSuccessStory(String successStory) { this.successStory = successStory; }

    public String getPartnerId() { return partnerId; }
    public void setPartnerId(String partnerId) { this.partnerId = partnerId; }

    public LocalDateTime getRenewedUntil() { return renewedUntil; }
    public void setRenewedUntil(LocalDateTime renewedUntil) { this.renewedUntil = renewedUntil; }
}
