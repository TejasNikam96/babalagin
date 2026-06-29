package com.example.login.controller;

import java.io.IOException;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

import javax.validation.Valid;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.login.dto.PaymentResponse;
import com.example.login.dto.PaymentStatusUpdateRequest;
import com.example.login.entity.Payment;
import com.example.login.service.PaymentService;

/**
 * REST API for payment verification. The React payment dialog posts
 * multipart/form-data to {@code POST /api/payment/verify}.
 */
@RestController
@RequestMapping("/api/payment")
@CrossOrigin
public class PaymentController {

    private final PaymentService service;

    public PaymentController(PaymentService service) {
        this.service = service;
    }

    /** Accepts the payment details + screenshot upload and stores them. */
    @PostMapping(value = "/verify", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PaymentResponse> verify(
            @RequestParam("transactionId") String transactionId,
            @RequestParam(value = "upiId", required = false) String upiId,
            @RequestParam(value = "amount", required = false) String amount,
            @RequestParam(value = "registrationId", required = false) String registrationId,
            @RequestParam(value = "screenshot", required = false) MultipartFile screenshot,
            @RequestParam(value = "paymentType", required = false) String paymentType,
            @RequestParam(value = "renewalMonths", required = false) Integer renewalMonths) {

        Payment saved = service.verifyPayment(registrationId, transactionId, upiId, amount, screenshot,
                paymentType, renewalMonths);
        PaymentResponse body = new PaymentResponse(
            saved.getId(),
            saved.getRegistrationId(),
            saved.getTransactionId(),
            saved.getStatus(),
            "Payment received and pending verification.");
        return ResponseEntity.status(HttpStatus.CREATED).body(body);
    }

    /**
     * Admin action: mark a payment VERIFIED or REJECTED. Secured to ROLE_ADMIN
     * via HTTP Basic (see SecurityConfig).
     */
    @PutMapping("/{id}/status")
    public ResponseEntity<Payment> updateStatus(
            @PathVariable Long id,
            @Valid @RequestBody PaymentStatusUpdateRequest request) {
        Payment updated = service.updateStatus(id, request.getStatus(), request.getNote());
        return ResponseEntity.ok(updated);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getOne(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    /** Streams the stored payment screenshot (admin-only via security rules). */
    @GetMapping("/{id}/screenshot")
    public ResponseEntity<Resource> screenshot(@PathVariable Long id) throws IOException {
        Payment payment = service.getById(id);
        if (payment.getScreenshotPath() == null) {
            return ResponseEntity.notFound().build();
        }
        Path path = Paths.get(payment.getScreenshotPath());
        Resource resource = new UrlResource(path.toUri());
        if (!resource.exists() || !resource.isReadable()) {
            return ResponseEntity.notFound().build();
        }
        String contentType = payment.getScreenshotContentType() != null
            ? payment.getScreenshotContentType()
            : MediaType.APPLICATION_OCTET_STREAM_VALUE;
        return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(contentType))
            .body(resource);
    }

    @GetMapping
    public ResponseEntity<List<Payment>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}
