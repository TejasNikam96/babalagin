package com.example.login.service;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.example.login.entity.Document;

/** Business operations for user-uploaded documents/images (base64). */
public interface DocumentService {

    /** Stores an uploaded file as a base64 document. */
    Document upload(String registrationCode, String docType, MultipartFile file);

    /** The active (latest) document of a type for a user. */
    Optional<Document> getLatestByType(String registrationCode, String docType);

    /** All documents for a user (newest first). */
    List<Document> getByRegistrationCode(String registrationCode);

    /** Latest profile image for a user as a data URL, or null if none. */
    String getProfileImageDataUrl(String registrationCode);

    /** Number of profile images a user has (cheap count). */
    long countImages(String registrationCode);
}
