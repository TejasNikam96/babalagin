package com.example.login.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.login.entity.Registration;
import com.example.login.security.TokenAuthenticationFilter;
import com.example.login.service.RegistrationService;
import com.example.login.service.SessionService;

/**
 * Self-service profile API for the logged-in owner. Both endpoints require the
 * caller's session token (X-Auth-Token) and only allow access to the profile
 * that token belongs to. The owner may view all of their own details (incl.
 * email + renewal expiry) and edit everything except id and email.
 */
@RestController
@RequestMapping("/api/profile")
@CrossOrigin
public class ProfileSelfController {

    private final RegistrationService registrationService;
    private final SessionService sessionService;

    public ProfileSelfController(RegistrationService registrationService, SessionService sessionService) {
        this.registrationService = registrationService;
        this.sessionService = sessionService;
    }

    /** The owner's own full profile (includes email + renewedUntil). */
    @GetMapping("/me")
    public ResponseEntity<?> me(@RequestParam("code") String code,
            @RequestHeader(value = TokenAuthenticationFilter.HEADER, required = false) String token) {
        if (!owns(token, code)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(registrationService.getByRegistrationCode(code));
    }

    /** Owner edits their own profile (id + email are ignored/preserved). */
    @PutMapping("/me")
    public ResponseEntity<?> update(@RequestBody Registration body,
            @RequestHeader(value = TokenAuthenticationFilter.HEADER, required = false) String token) {
        String code = body.getRegistrationCode();
        if (code == null || !owns(token, code)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        return ResponseEntity.ok(registrationService.selfUpdate(code, body));
    }

    /** True only if the live session token belongs to the given registration code. */
    private boolean owns(String token, String code) {
        Optional<String> principal = sessionService.principalOf(token);
        return principal.isPresent() && principal.get().equals(code);
    }
}
