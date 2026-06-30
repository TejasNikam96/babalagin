package com.example.login.entity;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.UniqueConstraint;

/**
 * A "like" given by one profile ({@code fromCode}) to another ({@code toCode}).
 * The unique constraint enforces at most one like per (from, to) pair.
 */
@Entity
@Table(name = "profile_likes",
    uniqueConstraints = @UniqueConstraint(columnNames = {"from_code", "to_code"}))
public class ProfileLike {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "from_code", length = 20, nullable = false)
    private String fromCode;

    @Column(name = "to_code", length = 20, nullable = false)
    private String toCode;

    @Column(name = "created_date")
    private LocalDateTime createdDate;

    @PrePersist
    public void prePersist() {
        if (createdDate == null) createdDate = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFromCode() { return fromCode; }
    public void setFromCode(String fromCode) { this.fromCode = fromCode; }

    public String getToCode() { return toCode; }
    public void setToCode(String toCode) { this.toCode = toCode; }

    public LocalDateTime getCreatedDate() { return createdDate; }
    public void setCreatedDate(LocalDateTime createdDate) { this.createdDate = createdDate; }
}
