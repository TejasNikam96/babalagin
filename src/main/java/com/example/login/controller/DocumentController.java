package com.example.login.controller;

import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.login.dto.DocumentResponse;
import com.example.login.entity.Document;
import com.example.login.service.DocumentService;

/**
 * Document/image upload API. Files are stored base64-encoded in the documents
 * table. Used by the navbar to set/show a user's profile photo.
 */
@RestController
@RequestMapping("/api/documents")
@CrossOrigin
public class DocumentController {

    private final DocumentService service;

    public DocumentController(DocumentService service) {
        this.service = service;
    }

    /** Uploads a document (default type profileImage) and returns it as a data URL. */
    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<DocumentResponse> upload(
            @RequestParam("registrationCode") String registrationCode,
            @RequestParam(value = "docType", required = false, defaultValue = "profileImage") String docType,
            @RequestParam("file") MultipartFile file) {
        Document saved = service.upload(registrationCode, docType, file);
        return ResponseEntity.status(HttpStatus.CREATED).body(DocumentResponse.from(saved));
    }

    /** Returns the active (latest) profile image for a user, or 404 if none. */
    @GetMapping("/profile-image")
    public ResponseEntity<DocumentResponse> profileImage(@RequestParam("registrationCode") String registrationCode) {
        Optional<Document> doc = service.getLatestByType(registrationCode, "profileImage");
        return doc.map(d -> ResponseEntity.ok(DocumentResponse.from(d)))
            .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
