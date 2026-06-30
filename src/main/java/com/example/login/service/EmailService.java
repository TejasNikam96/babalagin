package com.example.login.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Sends notification emails over SMTP.
 *
 * <p>Disabled by default: with {@code app.email.enabled=false} (or no SMTP
 * server configured) it only logs what it <em>would</em> send. To turn it on,
 * set {@code app.email.enabled=true} and configure {@code spring.mail.*}
 * (host/port/username/password) in application.properties — no code change
 * needed. Sending is best-effort and never breaks the notification flow.</p>
 */
@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final boolean enabled;
    private final String from;
    private final JavaMailSender mailSender; // null when SMTP isn't configured

    public EmailService(@Value("${app.email.enabled:false}") boolean enabled,
                        @Value("${app.email.from:BABA LAGIN <no-reply@babalagin.in>}") String from,
                        ObjectProvider<JavaMailSender> mailSenderProvider) {
        this.enabled = enabled;
        this.from = from;
        this.mailSender = mailSenderProvider.getIfAvailable();
    }

    /** Sends a plain-text email (best-effort). No-op (logs only) when disabled. */
    public void send(String to, String subject, String body) {
        if (to == null || to.trim().isEmpty()) {
            return;
        }
        if (!enabled || mailSender == null) {
            log.info("[email disabled] would send to '{}' | subject='{}'", to, subject);
            return;
        }
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom(from);
            msg.setTo(to.trim());
            msg.setSubject(subject);
            msg.setText(body);
            mailSender.send(msg);
            log.info("Email sent to '{}' | subject='{}'", to, subject);
        } catch (Exception e) {
            log.warn("Email send failed to '{}': {}", to, e.getMessage());
        }
    }
}
