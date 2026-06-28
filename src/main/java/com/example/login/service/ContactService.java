package com.example.login.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.login.dto.ContactRequest;
import com.example.login.entity.ContactMessage;
import com.example.login.repository.ContactMessageRepository;

@Service
public class ContactService {

    private static final Logger log = LoggerFactory.getLogger(ContactService.class);

    private final ContactMessageRepository repository;

    public ContactService(ContactMessageRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public ContactMessage save(ContactRequest req) {
        ContactMessage m = new ContactMessage();
        m.setFullName(req.getName());
        m.setPhone(req.getPhone());
        m.setEmail(req.getEmail());
        m.setSubject(req.getSubject());
        m.setMessage(req.getMessage());
        ContactMessage saved = repository.save(m);
        log.info("Contact message saved: id={}, name={}, subject={}",
                saved.getId(), req.getName(), req.getSubject());
        return saved;
    }

    @Transactional(readOnly = true)
    public List<ContactMessage> getAll() {
        return repository.findAllByOrderByIdDesc();
    }
}
