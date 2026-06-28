package com.example.login.dto;

/**
 * Response body for {@code POST /api/login}.
 */
public class LoginResponse {

    private boolean success;
    private Long id;
    private String registrationCode;
    private String name;
    private String email;
    private String maritalStatus;
    private String instanceId;
    private String token;
    private String message;

    public LoginResponse() {
    }

    public static LoginResponse failure(String message) {
        LoginResponse r = new LoginResponse();
        r.success = false;
        r.message = message;
        return r;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getRegistrationCode() { return registrationCode; }
    public void setRegistrationCode(String registrationCode) { this.registrationCode = registrationCode; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMaritalStatus() { return maritalStatus; }
    public void setMaritalStatus(String maritalStatus) { this.maritalStatus = maritalStatus; }

    public String getInstanceId() { return instanceId; }
    public void setInstanceId(String instanceId) { this.instanceId = instanceId; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
