package com.example.login.controller;

import java.util.List;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.login.dto.RegistrationRequest;
import com.example.login.dto.RegistrationResponse;
import com.example.login.entity.Registration;
import com.example.login.service.RegistrationService;

/**
 * REST API for matrimonial registrations. The React enroll form posts to
 * {@code POST /api/registration}.
 */
@RestController
@RequestMapping("/api/registration")
@CrossOrigin // allows the React dev server (localhost:3000) to call the API
public class RegistrationController {

    private final RegistrationService service;

    public RegistrationController(RegistrationService service) {
        this.service = service;
    }

    /** Inserts a new registration into the database. */
    @PostMapping
    public ResponseEntity<RegistrationResponse> create(@Valid @RequestBody RegistrationRequest request) {
        Registration saved = service.register(request);
        RegistrationResponse body = new RegistrationResponse(
            saved.getId(),
            saved.getRegistrationCode(),
            "Your profile has been submitted successfully! Your login ID is " + saved.getRegistrationCode());
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    /**
     * Saves the personal-details draft when the user clicks "Next" on the
     * Personal step. Not validated (partial data allowed); deleted automatically
     * once the full profile is created.
     */
    @PostMapping("/temp")
    public ResponseEntity<java.util.Map<String, Object>> saveTemp(@RequestBody RegistrationRequest request) {
        com.example.login.entity.RegistrationTemp saved = service.saveTemp(request);
        java.util.Map<String, Object> body = new java.util.HashMap<>();
        body.put("id", saved.getId());
        body.put("message", "Draft saved.");
        return ResponseEntity.ok(body);
    }

    /** Fetches a single registration by id. */
    @GetMapping("/{id}")
    public ResponseEntity<Registration> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /** Lists all registrations. */
    @GetMapping
    public ResponseEntity<List<Registration>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
