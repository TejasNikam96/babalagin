package com.example.login.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.login.entity.Notification;
import com.example.login.service.NotificationService;

/**
 * Notifications + express-interest API (for logged-in profile users; stateless,
 * so the registration code is supplied by the client).
 */
@RestController
@CrossOrigin
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    /** A user's notifications + unread count. */
    @GetMapping("/api/notifications")
    public Map<String, Object> list(@RequestParam("registrationCode") String registrationCode) {
        List<Notification> items = service.list(registrationCode);
        Map<String, Object> body = new HashMap<>();
        body.put("items", items);
        body.put("unread", service.unread(registrationCode));
        return body;
    }

    /** Mark all of a user's notifications as read. */
    @PostMapping("/api/notifications/read")
    public Map<String, Object> markRead(@RequestParam("registrationCode") String registrationCode) {
        service.markAllRead(registrationCode);
        Map<String, Object> body = new HashMap<>();
        body.put("unread", 0);
        return body;
    }

    /** Express interest in a profile. */
    @PostMapping("/api/interest")
    public Map<String, Object> express(@RequestBody Map<String, String> req) {
        service.expressInterest(req.get("fromCode"), req.get("toCode"));
        Map<String, Object> body = new HashMap<>();
        body.put("message", "Interest sent.");
        return body;
    }

    /** Profiles the user is accepted-connected with (for the home "Accepted" section). */
    @GetMapping("/api/interest/accepted")
    public java.util.List<com.example.login.dto.ProfileSummary> accepted(@RequestParam("code") String code) {
        return service.getAcceptedProfiles(code);
    }

    /** Accept/reject a received interest. */
    @PostMapping("/api/interest/respond")
    public Map<String, Object> respond(@RequestBody Map<String, String> req) {
        Long id = Long.valueOf(req.get("notificationId"));
        service.respondToInterest(id, req.get("action"));
        Map<String, Object> body = new HashMap<>();
        body.put("message", "Done.");
        return body;
    }
}
