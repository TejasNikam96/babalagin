package com.example.login.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.login.security.TokenAuthenticationFilter;
import com.example.login.service.SessionService;

/**
 * Server-side session liveness endpoints, shared by admin and profile clients.
 *
 * <ul>
 *   <li>{@code GET /api/session/validate} — read-only check; 200 if the session
 *       is live, 401 once it has idled out (or the server was restarted). Does
 *       NOT extend the idle window, so polling can't keep a session alive.</li>
 *   <li>{@code POST /api/session/heartbeat} — records activity; extends the
 *       30-minute idle window. The client calls this on real user interaction.
 *       Returns 401 if the session has already expired.</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/session")
@CrossOrigin
public class SessionController {

    private final SessionService sessionService;

    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @GetMapping("/validate")
    public ResponseEntity<Map<String, Object>> validate(
            @RequestHeader(value = TokenAuthenticationFilter.HEADER, required = false) String token) {
        if (sessionService.isValid(token)) {
            return ResponseEntity.ok(body(true));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body(false));
    }

    @PostMapping("/heartbeat")
    public ResponseEntity<Map<String, Object>> heartbeat(
            @RequestHeader(value = TokenAuthenticationFilter.HEADER, required = false) String token) {
        if (sessionService.touch(token)) {
            return ResponseEntity.ok(body(true));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(body(false));
    }

    private Map<String, Object> body(boolean valid) {
        Map<String, Object> m = new HashMap<>();
        m.put("valid", valid);
        return m;
    }
}
