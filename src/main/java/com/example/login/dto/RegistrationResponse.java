package com.example.login.dto;

/**
 * Response body for {@code POST /api/registration}.
 *
 * <p>The React Redux slice reads {@code payload.id} (or {@code registrationId})
 * and {@code payload.message} on success, so both are returned here.</p>
 */
public class RegistrationResponse {

    private Long id;
    private String registrationId;
    private String registrationCode;
    private String message;

    public RegistrationResponse() {
    }

    public RegistrationResponse(Long id, String registrationCode, String message) {
        this.id = id;
        this.registrationId = id != null ? String.valueOf(id) : null;
        this.registrationCode = registrationCode;
        this.message = message;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRegistrationId() { return registrationId; }
    public void setRegistrationId(String registrationId) { this.registrationId = registrationId; }

    public String getRegistrationCode() { return registrationCode; }
    public void setRegistrationCode(String registrationCode) { this.registrationCode = registrationCode; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
