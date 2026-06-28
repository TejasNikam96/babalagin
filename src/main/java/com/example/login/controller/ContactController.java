package com.example.login.controller;

import java.util.HashMap;
import java.util.Map;

import javax.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.login.dto.ContactRequest;
import com.example.login.entity.ContactMessage;
import com.example.login.service.ContactService;

/** Public "Contact Us" submission API. */
@RestController
@RequestMapping("/api/contact")
@CrossOrigin
public class ContactController {

    private final ContactService service;

    public ContactController(ContactService service) {
        this.service = service;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> submit(@Valid @RequestBody ContactRequest request) {
        ContactMessage saved = service.save(request);
        Map<String, Object> body = new HashMap<>();
        body.put("id", saved.getId());
        body.put("message", "Thank you! Your message has been received.");
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }
}
