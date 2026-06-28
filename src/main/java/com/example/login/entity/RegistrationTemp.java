package com.example.login.entity;

import java.time.LocalDateTime;

import javax.persistence.Embedded;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;

/**
 * A draft of the registration's personal details, saved when the user clicks
 * "Next" on the first (Personal) step of the enroll form. Rows live in the
 * {@code registrations_temp} table and are deleted once the full profile is
 * created. Lets us recover/track in-progress sign-ups.
 */
@Entity
@Table(name = "registrations_temp")
public class RegistrationTemp {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Reuses the same embeddable as Registration (p_* prefixed columns). */
    @Embedded
    private Personal personal;

    private LocalDateTime createdDate;
    private LocalDateTime updatedDate;

    @PrePersist
    public void prePersist() {
        LocalDateTime now = LocalDateTime.now();
        if (createdDate == null) createdDate = now;
        updatedDate = now;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Personal getPersonal() { return personal; }
    public void setPersonal(Personal personal) { this.personal = personal; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }

    public LocalDateTime getUpdatedDate() { return updatedDate; }
    public void setUpdatedDate(LocalDateTime updatedDate) { this.updatedDate = updatedDate; }
}
