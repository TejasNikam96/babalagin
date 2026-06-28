package com.example.login.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;

/**
 * Request body for {@code POST /api/login} (profile login).
 * Validated against the registrations table.
 */
public class LoginRequest {

    @NotBlank(message = "Registration ID is required")
    private String registrationId;

    @NotBlank(message = "Email is required")
    @Email(message = "A valid email is required")
    private String email;

    public String getRegistrationId() { return registrationId; }
    public void setRegistrationId(String registrationId) { this.registrationId = registrationId; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
