package com.example.login.service;

import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.login.dto.MessageResponse;
import com.example.login.entity.Message;
import com.example.login.entity.Personal;
import com.example.login.entity.Registration;
import com.example.login.repository.MessageRepository;
import com.example.login.repository.RegistrationRepository;

/**
 * In-app messaging between profiles that have an accepted-interest connection.
 * Sending/reading is only allowed between connected users.
 */
@Service
public class MessageService {

    private static final Logger log = LoggerFactory.getLogger(MessageService.class);

    private final MessageRepository repository;
    private final NotificationService notificationService;
    private final RegistrationRepository registrationRepository;

    public MessageService(MessageRepository repository, NotificationService notificationService,
                          RegistrationRepository registrationRepository) {
        this.repository = repository;
        this.notificationService = notificationService;
        this.registrationRepository = registrationRepository;
    }

    /** True if the two profiles have an accepted interest (either direction). */
    @Transactional(readOnly = true)
    public boolean canMessage(String a, String b) {
        return notificationService.areConnected(a, b);
    }

    /** Send a message from one connected profile to another. */
    @Transactional
    public MessageResponse send(String fromCode, String toCode, String content) {
        Message m = new Message();
        m.setFromCode(fromCode);
        m.setToCode(toCode);
        m.setContent(content.trim());
        Message saved = repository.save(m);
        log.info("Message sent: from={} to={} id={}", fromCode, toCode, saved.getId());

        // Notify the recipient (shows in their bell).
        String fromName = nameOf(fromCode);
        notificationService.create(toCode, "MESSAGE",
            "New message from " + fromName + ".", fromCode, fromName, null);

        return MessageResponse.from(saved);
    }

    /** The conversation between two profiles, oldest first. */
    @Transactional(readOnly = true)
    public List<MessageResponse> conversation(String a, String b) {
        return repository.findConversation(a, b).stream()
            .map(MessageResponse::from)
            .collect(Collectors.toList());
    }

    private String nameOf(String code) {
        Registration r = registrationRepository.findByRegistrationCode(code).orElse(null);
        if (r != null && r.getPersonal() != null) {
            Personal p = r.getPersonal();
            String name = ((p.getFirstName() != null ? p.getFirstName() : "") + " "
                + (p.getLastName() != null ? p.getLastName() : "")).trim();
            if (!name.isEmpty()) return name;
        }
        return code;
    }
}
