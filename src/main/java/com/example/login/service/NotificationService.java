package com.example.login.service;

import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.login.dto.ProfileSummary;
import com.example.login.entity.Notification;
import com.example.login.entity.Personal;
import com.example.login.entity.Registration;
import com.example.login.repository.NotificationRepository;
import com.example.login.repository.RegistrationRepository;

@Service
public class NotificationService {

    private static final Logger log = LoggerFactory.getLogger(NotificationService.class);

    /** Notification types that also trigger an email to the recipient. */
    private static final java.util.Set<String> EMAIL_TYPES = new java.util.HashSet<>(java.util.Arrays.asList(
        "PAYMENT", "INTEREST_RECEIVED", "INTEREST_ACCEPTED"));

    private final NotificationRepository repository;
    private final RegistrationRepository registrationRepository;
    private final DocumentService documentService;
    private final EmailService emailService;

    public NotificationService(NotificationRepository repository, RegistrationRepository registrationRepository,
                              DocumentService documentService, EmailService emailService) {
        this.repository = repository;
        this.registrationRepository = registrationRepository;
        this.documentService = documentService;
        this.emailService = emailService;
    }

    @Transactional
    public Notification create(String toCode, String type, String message,
                              String fromCode, String fromName, String status) {
        Notification n = new Notification();
        n.setRegistrationCode(toCode);
        n.setType(type);
        n.setMessage(message);
        n.setFromCode(fromCode);
        n.setFromName(fromName);
        n.setStatus(status);
        n.setRead(false);
        Notification saved = repository.save(n);

        // Email the recipient for important notifications (best-effort).
        if (type != null && EMAIL_TYPES.contains(type)) {
            String email = emailOf(toCode);
            if (email != null) {
                emailService.send(email, "BABA LAGIN — Notification",
                    message + "\n\nLog in to BABA LAGIN to view details.\n\n— BABA LAGIN Vadhu-Var Kendra");
            }
        }
        return saved;
    }

    /** Recipient's email for a registration code, or null. */
    private String emailOf(String code) {
        if (code == null) return null;
        Registration r = registrationRepository.findByRegistrationCode(code).orElse(null);
        return (r != null && r.getPersonal() != null) ? r.getPersonal().getEmail() : null;
    }

    @Transactional(readOnly = true)
    public List<Notification> list(String registrationCode) {
        return repository.findByRegistrationCodeOrderByIdDesc(registrationCode);
    }

    /** All notifications with recipient name + mobile, for the admin page. */
    @Transactional(readOnly = true)
    public List<com.example.login.dto.AdminNotificationView> adminListAll() {
        List<com.example.login.dto.AdminNotificationView> out = new java.util.ArrayList<>();
        for (Notification n : repository.findAllByOrderByIdDesc()) {
            com.example.login.dto.AdminNotificationView v = new com.example.login.dto.AdminNotificationView();
            v.setId(n.getId());
            v.setRegistrationCode(n.getRegistrationCode());
            v.setType(n.getType());
            v.setMessage(n.getMessage());
            v.setFromName(n.getFromName());
            v.setStatus(n.getStatus());
            v.setRead(n.isRead());
            v.setCreatedDate(n.getCreatedDate());
            Registration r = n.getRegistrationCode() == null ? null
                : registrationRepository.findByRegistrationCode(n.getRegistrationCode()).orElse(null);
            if (r != null && r.getPersonal() != null) {
                Personal p = r.getPersonal();
                String name = ((p.getFirstName() != null ? p.getFirstName() : "") + " "
                    + (p.getLastName() != null ? p.getLastName() : "")).trim();
                v.setRecipientName(name.isEmpty() ? n.getRegistrationCode() : name);
                v.setRecipientMobile(p.getMobile());
            } else {
                v.setRecipientName(n.getRegistrationCode());
            }
            out.add(v);
        }
        return out;
    }

    @Transactional(readOnly = true)
    public long unread(String registrationCode) {
        return repository.countByRegistrationCodeAndReadFalse(registrationCode);
    }

    @Transactional
    public void markAllRead(String registrationCode) {
        List<Notification> items = repository.findByRegistrationCodeOrderByIdDesc(registrationCode);
        for (Notification n : items) {
            if (!n.isRead()) {
                n.setRead(true);
            }
        }
        repository.saveAll(items);
    }

    /** Someone expresses interest -> notify the target profile. */
    @Transactional
    public Notification expressInterest(String fromCode, String toCode) {
        log.info("Interest expressed: from={} -> to={}", fromCode, toCode);
        String fromName = nameOf(fromCode, fromCode);
        return create(toCode, "INTEREST_RECEIVED",
            fromName + " (" + fromCode + ") expressed interest in your profile.",
            fromCode, fromName, "PENDING");
    }

    /** Recipient accepts/rejects an interest -> notify the original sender. */
    @Transactional
    public void respondToInterest(Long notificationId, String action) {
        Notification n = repository.findById(notificationId).orElse(null);
        if (n == null || !"INTEREST_RECEIVED".equals(n.getType())) {
            log.warn("Interest response ignored: notificationId={} not found or wrong type", notificationId);
            return;
        }
        boolean accept = "ACCEPT".equalsIgnoreCase(action) || "ACCEPTED".equalsIgnoreCase(action);
        log.info("Interest {} : notificationId={}, responder={}, originalSender={}",
                accept ? "ACCEPTED" : "REJECTED", notificationId, n.getRegistrationCode(), n.getFromCode());
        n.setStatus(accept ? "ACCEPTED" : "REJECTED");
        n.setRead(true);
        repository.save(n);

        String responderName = nameOf(n.getRegistrationCode(), n.getRegistrationCode());
        create(n.getFromCode(),
            accept ? "INTEREST_ACCEPTED" : "INTEREST_REJECTED",
            responderName + " has " + (accept ? "accepted" : "rejected") + " your interest.",
            n.getRegistrationCode(), responderName, null);
    }

    /**
     * Rejects an existing accepted connection between {@code viewerCode} and
     * {@code otherCode}: flips the underlying accepted INTEREST_RECEIVED
     * notification(s) (in either direction) to REJECTED, so the pair are no
     * longer connected. Notifies the other party.
     *
     * @return true if at least one accepted connection was rejected.
     */
    @Transactional
    public boolean rejectConnection(String viewerCode, String otherCode) {
        if (viewerCode == null || otherCode == null) {
            return false;
        }
        List<Notification> matches = new java.util.ArrayList<>();
        // interest the viewer sent that the other accepted
        matches.addAll(repository.findByFromCodeAndRegistrationCodeAndTypeAndStatus(
            viewerCode, otherCode, "INTEREST_RECEIVED", "ACCEPTED"));
        // interest the other sent that the viewer accepted
        matches.addAll(repository.findByFromCodeAndRegistrationCodeAndTypeAndStatus(
            otherCode, viewerCode, "INTEREST_RECEIVED", "ACCEPTED"));

        if (matches.isEmpty()) {
            log.warn("Reject connection: no accepted interest between {} and {}", viewerCode, otherCode);
            return false;
        }
        for (Notification n : matches) {
            n.setStatus("REJECTED");
            n.setRead(true);
        }
        repository.saveAll(matches);
        log.info("Connection rejected: {} removed accepted connection with {}", viewerCode, otherCode);

        // Let the other party know the connection was withdrawn.
        String viewerName = nameOf(viewerCode, viewerCode);
        create(otherCode, "INTEREST_REJECTED",
            viewerName + " has withdrawn the accepted connection.",
            viewerCode, viewerName, null);
        return true;
    }

    /** Codes the given user is "accepted-connected" with (either direction). */
    @Transactional(readOnly = true)
    public Set<String> getAcceptedCodes(String code) {
        Set<String> codes = new LinkedHashSet<>();
        // interests this user expressed that were accepted -> the acceptor codes
        for (Notification n : repository.findByFromCodeAndTypeAndStatus(code, "INTEREST_RECEIVED", "ACCEPTED")) {
            if (n.getRegistrationCode() != null) codes.add(n.getRegistrationCode());
        }
        // interests this user received and accepted -> the sender codes
        for (Notification n : repository.findByRegistrationCodeAndTypeAndStatus(code, "INTEREST_RECEIVED", "ACCEPTED")) {
            if (n.getFromCode() != null) codes.add(n.getFromCode());
        }
        return codes;
    }

    /** Profile summaries of a user's accepted connections. */
    @Transactional(readOnly = true)
    public List<ProfileSummary> getAcceptedProfiles(String code) {
        return getAcceptedCodes(code).stream()
            .map(c -> registrationRepository.findByRegistrationCode(c).orElse(null))
            .filter(r -> r != null)
            .map(r -> {
                ProfileSummary ps = ProfileSummary.from(r);
                ps.setPhoto(documentService.getProfileImageDataUrl(ps.getRegistrationCode()));
                ps.setPhotoCount((int) documentService.countImages(ps.getRegistrationCode()));
                return ps;
            })
            .collect(Collectors.toList());
    }

    /** True if a and b have an accepted interest in either direction. */
    @Transactional(readOnly = true)
    public boolean areConnected(String a, String b) {
        if (a == null || b == null) return false;
        return repository.existsByFromCodeAndRegistrationCodeAndTypeAndStatus(a, b, "INTEREST_RECEIVED", "ACCEPTED")
            || repository.existsByFromCodeAndRegistrationCodeAndTypeAndStatus(b, a, "INTEREST_RECEIVED", "ACCEPTED");
    }

    private String nameOf(String code, String fallback) {
        if (code == null) {
            return fallback;
        }
        Registration r = registrationRepository.findByRegistrationCode(code).orElse(null);
        if (r != null && r.getPersonal() != null) {
            Personal p = r.getPersonal();
            String name = ((p.getFirstName() != null ? p.getFirstName() : "") + " "
                + (p.getLastName() != null ? p.getLastName() : "")).trim();
            if (!name.isEmpty()) {
                return name;
            }
        }
        return fallback;
    }
}
