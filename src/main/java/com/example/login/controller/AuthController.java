package com.example.login.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Authentication helper endpoints. The React admin login page calls
 * {@code GET /api/auth/me} with the entered credentials (HTTP Basic); a 200
 * response confirms the credentials are valid and returns the user's roles.
 */
@RestController
@RequestMapping("/api/auth")
@CrossOrigin
public class AuthController {

    /** Returns the currently authenticated user's username and roles. */
    @GetMapping("/me")
    public Map<String, Object> me(Authentication authentication) {
        List<String> roles = authentication.getAuthorities().stream()
            .map(GrantedAuthority::getAuthority)
            .collect(Collectors.toList());

        Map<String, Object> body = new HashMap<>();
        body.put("username", authentication.getName());
        body.put("roles", roles);
        return body;
    }
}
