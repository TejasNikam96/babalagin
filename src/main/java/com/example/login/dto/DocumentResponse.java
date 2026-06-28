package com.example.login.dto;

import java.time.LocalDateTime;

import com.example.login.entity.Document;

/**
 * Response for document endpoints. Includes a ready-to-use data URL so the
 * frontend can render it directly in an &lt;img src&gt;.
 */
public class DocumentResponse {

    private Long id;
    private String registrationCode;
    private String docType;
    private String fileName;
    private String contentType;
    private String dataUrl;
    private LocalDateTime createdAt;

    public static DocumentResponse from(Document d) {
        DocumentResponse r = new DocumentResponse();
        r.id = d.getId();
        r.registrationCode = d.getRegistrationCode();
        r.docType = d.getDocType();
        r.fileName = d.getFileName();
        r.contentType = d.getContentType();
        String ct = d.getContentType() != null ? d.getContentType() : "application/octet-stream";
        r.dataUrl = "data:" + ct + ";base64," + d.getDataBase64();
        r.createdAt = d.getCreatedAt();
        return r;
    }

    public Long getId() { return id; }
    public String getRegistrationCode() { return registrationCode; }
    public String getDocType() { return docType; }
    public String getFileName() { return fileName; }
    public String getContentType() { return contentType; }
    public String getDataUrl() { return dataUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
