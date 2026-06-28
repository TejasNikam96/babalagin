package com.example.login.service;

import java.io.IOException;
import java.util.Base64;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.example.login.entity.Document;
import com.example.login.repository.DocumentRepository;

@Service
public class DocumentServiceImpl implements DocumentService {

    private final DocumentRepository repository;

    public DocumentServiceImpl(DocumentRepository repository) {
        this.repository = repository;
    }

    @Override
    @Transactional
    public Document upload(String registrationCode, String docType, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("No file provided.");
        }
        try {
            String base64 = Base64.getEncoder().encodeToString(file.getBytes());
            Document doc = new Document();
            doc.setRegistrationCode(registrationCode);
            doc.setDocType(docType != null && !docType.isEmpty() ? docType : "profileImage");
            doc.setFileName(StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "upload" : file.getOriginalFilename()));
            doc.setContentType(file.getContentType());
            doc.setDataBase64(base64);
            return repository.save(doc);
        } catch (IOException e) {
            throw new RuntimeException("Failed to read uploaded file: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Document> getLatestByType(String registrationCode, String docType) {
        return repository.findFirstByRegistrationCodeAndDocTypeOrderByIdDesc(registrationCode, docType);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Document> getByRegistrationCode(String registrationCode) {
        return repository.findByRegistrationCodeOrderByIdDesc(registrationCode);
    }

    @Override
    @Transactional(readOnly = true)
    public String getProfileImageDataUrl(String registrationCode) {
        return getLatestByType(registrationCode, "profileImage")
            .map(d -> {
                String ct = d.getContentType() != null ? d.getContentType() : "application/octet-stream";
                return "data:" + ct + ";base64," + d.getDataBase64();
            })
            .orElse(null);
    }
}
