package com.example.login.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.login.entity.Personal;
import com.example.login.entity.Registration;
import com.example.login.service.RegistrationService;

/**
 * Profile-renewal helper API. Validates that the Registration ID + email match
 * an existing profile before the renewal payment is collected (the payment then
 * goes through the normal /api/payment/verify flow with paymentType=RENEWAL).
 */
@RestController
@RequestMapping("/api/renewal")
@CrossOrigin
public class RenewalController {

    private final RegistrationService registrationService;

    public RenewalController(RegistrationService registrationService) {
        this.registrationService = registrationService;
    }

    /** Confirms the Registration ID + email belong to a real profile. */
    @PostMapping("/validate")
    public ResponseEntity<Map<String, Object>> validate(@RequestBody Map<String, String> req) {
        Optional<Registration> match =
            registrationService.login(req.get("registrationId"), req.get("email"));

        Map<String, Object> body = new HashMap<>();
        if (!match.isPresent()) {
            body.put("valid", false);
            body.put("message", "No profile found for this Registration ID and email.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body);
        }
        Registration r = match.get();
        Personal p = r.getPersonal();
        body.put("valid", true);
        body.put("registrationCode", r.getRegistrationCode());
        body.put("name", p != null ? ((p.getFirstName() != null ? p.getFirstName() : "") + " "
            + (p.getLastName() != null ? p.getLastName() : "")).trim() : null);
        body.put("isActive", r.getIsActive());
        return ResponseEntity.ok(body);
    }
}
