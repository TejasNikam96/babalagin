package com.example.login.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * An application user used for authentication. Stored in the {@code users} table.
 *
 * <p>Named {@code AppUser} to avoid clashing with Spring Security's own
 * {@code User} class. There is no self-service signup; admins are seeded at
 * startup (see {@code DataInitializer}).</p>
 */
@Entity
@Table(name = "users")
public class AppUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String username;

    /** BCrypt-hashed password. */
    @Column(nullable = false)
    private String password;

    /** Role without the ROLE_ prefix, e.g. "ADMIN" or "USER". */
    @Column(nullable = false)
    private String role;

    @Column(nullable = false)
    private boolean enabled = true;

    public AppUser() {
    }

    public AppUser(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
        this.enabled = true;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public boolean isEnabled() { return enabled; }
    public void setEnabled(boolean enabled) { this.enabled = enabled; }
}
