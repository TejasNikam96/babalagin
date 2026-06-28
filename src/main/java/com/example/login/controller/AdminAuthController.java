package com.example.login.controller;

import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.login.config.ServerInstance;
import com.example.login.entity.AppUser;
import com.example.login.repository.AppUserRepository;
import com.example.login.security.TokenAuthenticationFilter;
import com.example.login.service.SessionService;

/**
 * Admin authentication. Validates username/password against the {@code users}
 * table and issues a server-side session token (with a 30-minute idle timeout).
 * The token must be sent as {@code X-Auth-Token} on subsequent admin requests.
 *
 * <p>{@code /api/admin/login} is permitted for everyone (see SecurityConfig);
 * all other {@code /api/admin/**} endpoints require a valid admin token.</p>
 */
@RestController
@RequestMapping("/api/admin")
@CrossOrigin
public class AdminAuthController {

    private final AppUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SessionService sessionService;
    private final ServerInstance serverInstance;

    public AdminAuthController(AppUserRepository userRepository, PasswordEncoder passwordEncoder,
                              SessionService sessionService, ServerInstance serverInstance) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.sessionService = sessionService;
        this.serverInstance = serverInstance;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");

        Optional<AppUser> match = username == null ? Optional.empty()
            : userRepository.findByUsername(username);

        if (!match.isPresent() || !match.get().isEnabled()
                || password == null
                || !passwordEncoder.matches(password, match.get().getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(error("Invalid username or password."));
        }

        AppUser user = match.get();
        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN)
                .body(error("This account is not an administrator."));
        }

        String token = sessionService.create(user.getUsername(), "ADMIN");

        Map<String, Object> resp = new HashMap<>();
        resp.put("token", token);
        resp.put("username", user.getUsername());
        resp.put("roles", Arrays.asList("ROLE_ADMIN"));
        resp.put("instanceId", serverInstance.getId());
        return ResponseEntity.ok(resp);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(
            @RequestHeader(value = TokenAuthenticationFilter.HEADER, required = false) String token) {
        sessionService.invalidate(token);
        return ResponseEntity.noContent().build();
    }

    private Map<String, Object> error(String message) {
        Map<String, Object> m = new HashMap<>();
        m.put("message", message);
        return m;
    }
}
