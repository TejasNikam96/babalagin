package com.example.login.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.login.dto.MessageResponse;
import com.example.login.service.MessageService;

/**
 * In-app messaging API for logged-in profile users. Both reading and sending
 * are restricted to profiles that have an accepted-interest connection.
 */
@RestController
@RequestMapping("/api/messages")
@CrossOrigin
public class MessageController {

    private final MessageService service;

    public MessageController(MessageService service) {
        this.service = service;
    }

    /** Conversation between {@code code} and {@code withCode}. */
    @GetMapping
    public ResponseEntity<?> conversation(@RequestParam("code") String code,
                                          @RequestParam("withCode") String withCode) {
        if (!service.canMessage(code, withCode)) {
            return forbidden();
        }
        List<MessageResponse> msgs = service.conversation(code, withCode);
        return ResponseEntity.ok(msgs);
    }

    /** Send a message. Allowed only between accepted connections. */
    @PostMapping
    public ResponseEntity<?> send(@RequestBody Map<String, String> req) {
        String fromCode = req.get("fromCode");
        String toCode = req.get("toCode");
        String content = req.get("content");

        if (fromCode == null || toCode == null || content == null || content.trim().isEmpty()) {
            Map<String, Object> b = new HashMap<>();
            b.put("message", "fromCode, toCode and a non-empty content are required.");
            return ResponseEntity.badRequest().body(b);
        }
        if (!service.canMessage(fromCode, toCode)) {
            return forbidden();
        }
        return ResponseEntity.ok(service.send(fromCode, toCode, content));
    }

    private ResponseEntity<Map<String, Object>> forbidden() {
        Map<String, Object> b = new HashMap<>();
        b.put("message", "You can only message a profile after the interest is accepted.");
        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(b);
    }
}
