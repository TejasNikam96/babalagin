package com.example.login.controller;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.login.dto.AdminProfileView;
import com.example.login.entity.ContactMessage;
import com.example.login.entity.Payment;
import com.example.login.entity.Registration;
import com.example.login.service.ContactService;
import com.example.login.service.PaymentService;
import com.example.login.service.RegistrationService;

/**
 * Admin-only data endpoints (secured to ROLE_ADMIN via /api/admin/** in SecurityConfig).
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminController {

    private final RegistrationService registrationService;
    private final PaymentService paymentService;
    private final ContactService contactService;
    private final com.example.login.service.NotificationService notificationService;

    public AdminController(RegistrationService registrationService, PaymentService paymentService,
                          ContactService contactService,
                          com.example.login.service.NotificationService notificationService) {
        this.registrationService = registrationService;
        this.paymentService = paymentService;
        this.contactService = contactService;
        this.notificationService = notificationService;
    }

    /** All Contact-Us submissions (admin). */
    @GetMapping("/contacts")
    public List<ContactMessage> contacts() {
        return contactService.getAll();
    }

    /** All notifications with recipient name + mobile (for WhatsApp click-to-send). */
    @GetMapping("/notifications")
    public List<com.example.login.dto.AdminNotificationView> notifications() {
        return notificationService.adminListAll();
    }

    /**
     * All registrations with full details + payment status, filtered by
     * isActive, created-date range and payment status (all optional).
     */
    @GetMapping("/profiles")
    public List<AdminProfileView> profiles(
            @RequestParam(value = "gender", required = false) String gender,
            @RequestParam(value = "isActive", required = false) String isActive,
            @RequestParam(value = "createdFrom", required = false) String createdFrom,
            @RequestParam(value = "createdTo", required = false) String createdTo,
            @RequestParam(value = "paymentStatus", required = false) String paymentStatus) {

        List<Registration> regs = registrationService.adminSearch(gender, isActive, createdFrom, createdTo);

        List<AdminProfileView> out = new ArrayList<>();
        for (Registration r : regs) {
            String status = latestPaymentStatus(r.getRegistrationCode());
            if (paymentStatus != null && !paymentStatus.trim().isEmpty()
                    && !paymentStatus.equalsIgnoreCase(status)) {
                continue;
            }
            out.add(new AdminProfileView(r, status));
        }
        return out;
    }

    /** Admin edit: update all editable fields of a registration (id stays fixed). */
    @PutMapping("/profiles/{id}")
    public AdminProfileView updateProfile(@PathVariable Long id, @RequestBody Registration body) {
        Registration saved = registrationService.adminUpdate(id, body);
        return new AdminProfileView(saved, latestPaymentStatus(saved.getRegistrationCode()));
    }

    /** Admin: set the payment status for a registration (from the edit page). */
    @PutMapping("/profiles/{id}/payment-status")
    public AdminProfileView updatePaymentStatus(@PathVariable Long id, @RequestParam String status) {
        Registration reg = registrationService.getById(id);
        paymentService.setStatusByRegistrationCode(reg.getRegistrationCode(), status);
        return new AdminProfileView(reg, latestPaymentStatus(reg.getRegistrationCode()));
    }

    /** Status of the most recent payment for a registration, or "NONE". */
    private String latestPaymentStatus(String registrationCode) {
        if (registrationCode == null) {
            return "NONE";
        }
        List<Payment> payments = paymentService.getByRegistrationId(registrationCode);
        return payments.stream()
            .max(Comparator.comparing(Payment::getId))
            .map(Payment::getStatus)
            .orElse("NONE");
    }
}
