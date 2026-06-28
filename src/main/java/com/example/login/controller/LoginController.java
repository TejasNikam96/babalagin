package com.example.login.controller;

import java.util.List;
import java.util.Optional;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.login.config.ServerInstance;
import com.example.login.dto.LoginRequest;
import com.example.login.dto.LoginResponse;
import com.example.login.entity.Payment;
import com.example.login.entity.Personal;
import com.example.login.entity.Registration;
import com.example.login.service.PaymentService;
import com.example.login.service.RegistrationService;

/**
 * Profile-login API. Validates a Registration ID + email against the
 * registrations table.
 */
@RestController
@RequestMapping("/api/login")
@CrossOrigin
public class LoginController {

    private static final org.slf4j.Logger log = org.slf4j.LoggerFactory.getLogger(LoginController.class);

    private final RegistrationService registrationService;
    private final PaymentService paymentService;
    private final ServerInstance serverInstance;
    private final com.example.login.service.SessionService sessionService;

    public LoginController(RegistrationService registrationService, PaymentService paymentService,
                          ServerInstance serverInstance,
                          com.example.login.service.SessionService sessionService) {
        this.registrationService = registrationService;
        this.paymentService = paymentService;
        this.serverInstance = serverInstance;
        this.sessionService = sessionService;
    }

    /** Lets the frontend detect a server restart (id changes each JVM run). */
    @org.springframework.web.bind.annotation.GetMapping("/server-info")
    public java.util.Map<String, String> serverInfo() {
        java.util.Map<String, String> m = new java.util.HashMap<>();
        m.put("instanceId", serverInstance.getId());
        return m;
    }

    @PostMapping
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        Optional<Registration> match =
            registrationService.login(request.getRegistrationId(), request.getEmail());

        if (!match.isPresent()) {
            log.warn("Profile login failed (invalid id/email) for id='{}'", request.getRegistrationId());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(LoginResponse.failure("Invalid Registration ID or Email."));
        }

        Registration reg = match.get();

        // Login is allowed only once the registration's payment is VERIFIED by an admin.
        List<Payment> payments = paymentService.getByRegistrationId(reg.getRegistrationCode());
        boolean verified = payments.stream()
            .anyMatch(pm -> "VERIFIED".equalsIgnoreCase(pm.getStatus()));
        if (!verified) {
            boolean rejected = payments.stream()
                .anyMatch(pm -> "REJECTED".equalsIgnoreCase(pm.getStatus()));
            String msg = rejected
                ? "Your payment was rejected by the admin. Please contact support or resubmit your payment."
                : "Your payment is pending verification by the admin. You can log in once it is approved.";
            log.warn("Profile login blocked for code={} (payment {})",
                    reg.getRegistrationCode(), rejected ? "REJECTED" : "PENDING");
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(LoginResponse.failure(msg));
        }

        Personal p = reg.getPersonal();

        LoginResponse body = new LoginResponse();
        body.setSuccess(true);
        body.setId(reg.getId());
        body.setRegistrationCode(reg.getRegistrationCode());
        body.setName(fullName(p));
        body.setEmail(p != null ? p.getEmail() : null);
        body.setMaritalStatus(p != null ? p.getMaritalStatus() : null);
        body.setInstanceId(serverInstance.getId());
        // Issue a server-side session token (30-minute idle timeout).
        body.setToken(sessionService.create(reg.getRegistrationCode(), "PROFILE"));
        body.setMessage("Login successful.");
        log.info("Profile login success: code={}", reg.getRegistrationCode());
        return ResponseEntity.ok(body);
    }

    private String fullName(Personal p) {
        if (p == null) {
            return null;
        }
        StringBuilder sb = new StringBuilder();
        if (p.getFirstName() != null) sb.append(p.getFirstName());
        if (p.getLastName() != null) sb.append(sb.length() > 0 ? " " : "").append(p.getLastName());
        return sb.toString();
    }
}
