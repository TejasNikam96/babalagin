package com.example.login.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.login.dto.ContactRequest;
import com.example.login.entity.ContactMessage;
import com.example.login.repository.ContactMessageRepository;

@Service
public class ContactService {

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
        return repository.save(m);
    }

    @Transactional(readOnly = true)
    public List<ContactMessage> getAll() {
        return repository.findAllByOrderByIdDesc();
    }
}
