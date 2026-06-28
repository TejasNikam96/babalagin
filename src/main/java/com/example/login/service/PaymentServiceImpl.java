package com.example.login.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import com.example.login.entity.Payment;
import com.example.login.exception.ResourceNotFoundException;
import com.example.login.repository.PaymentRepository;

@Service
public class PaymentServiceImpl implements PaymentService {

    private final PaymentRepository repository;
    private final NotificationService notificationService;
    private final Path uploadDir;

    public PaymentServiceImpl(PaymentRepository repository,
                              NotificationService notificationService,
                              @Value("${app.upload.dir:uploads/payments}") String uploadDir) {
        this.repository = repository;
        this.notificationService = notificationService;
        this.uploadDir = Paths.get(uploadDir).toAbsolutePath().normalize();
    }

    @Override
    @Transactional
    public Payment verifyPayment(String registrationId, String transactionId, String upiId,
                                 String amount, MultipartFile screenshot) {
        Payment payment = new Payment();
        payment.setRegistrationId(registrationId);
        payment.setTransactionId(transactionId);
        payment.setUpiId(upiId);
        payment.setAmount(amount);
        payment.setStatus("PENDING_VERIFICATION");

        if (screenshot != null && !screenshot.isEmpty()) {
            String stored = storeScreenshot(screenshot);
            payment.setScreenshotPath(stored);
            payment.setScreenshotFilename(StringUtils.cleanPath(
                screenshot.getOriginalFilename() == null ? "" : screenshot.getOriginalFilename()));
            payment.setScreenshotContentType(screenshot.getContentType());
        }

        return repository.save(payment);
    }

    private String storeScreenshot(MultipartFile file) {
        try {
            Files.createDirectories(uploadDir);
            String original = StringUtils.cleanPath(
                file.getOriginalFilename() == null ? "screenshot" : file.getOriginalFilename());
            String ext = "";
            int dot = original.lastIndexOf('.');
            if (dot >= 0) {
                ext = original.substring(dot);
            }
            String filename = UUID.randomUUID() + ext;
            Path target = uploadDir.resolve(filename);
            file.transferTo(target);
            return target.toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to store payment screenshot: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Payment getById(Long id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Payment not found with id " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payment> getAll() {
        return repository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Payment> getByRegistrationId(String registrationId) {
        return repository.findByRegistrationId(registrationId);
    }

    @Override
    @Transactional
    public Payment updateStatus(Long id, String status, String note) {
        Payment payment = getById(id);
        payment.setStatus(status);
        payment.setStatusNote(note);
        payment.setUpdatedAt(LocalDateTime.now());
        Payment saved = repository.save(payment);

        // Notify the registration owner about the payment decision.
        if (saved.getRegistrationId() != null) {
            String msg = "Your payment (txn " + saved.getTransactionId() + ") has been "
                + status + " by admin." + (note != null && !note.isEmpty() ? " Note: " + note : "");
            notificationService.create(saved.getRegistrationId(), "PAYMENT", msg, null, null, null);
        }
        return saved;
    }

    @Override
    @Transactional
    public Payment setStatusByRegistrationCode(String registrationCode, String status) {
        List<Payment> payments = repository.findByRegistrationId(registrationCode);
        if (!payments.isEmpty()) {
            Payment latest = payments.stream().max(Comparator.comparing(Payment::getId)).get();
            return updateStatus(latest.getId(), status, "Set by admin");
        }
        // No payment yet -> create one carrying the chosen status.
        Payment p = new Payment();
        p.setRegistrationId(registrationCode);
        p.setTransactionId("ADMIN-SET");
        p.setStatus(status);
        Payment saved = repository.save(p);
        notificationService.create(registrationCode, "PAYMENT",
            "Your payment status has been set to " + status + " by admin.", null, null, null);
        return saved;
    }
}
