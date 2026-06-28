package com.example.login.security;

import java.io.IOException;
import java.util.Collections;
import java.util.Optional;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.web.filter.OncePerRequestFilter;

import com.example.login.service.SessionService;

/**
 * Authenticates requests that carry a valid server-side session token in the
 * {@code X-Auth-Token} header. The token is validated against
 * {@link SessionService}; if it is live (not idle-expired) the request runs as
 * the session's role (e.g. {@code ROLE_ADMIN}). Validation does NOT extend the
 * idle window — activity is recorded only via the explicit heartbeat endpoint.
 */
public class TokenAuthenticationFilter extends OncePerRequestFilter {

    public static final String HEADER = "X-Auth-Token";

    private final SessionService sessionService;

    public TokenAuthenticationFilter(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String token = request.getHeader(HEADER);
        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            Optional<String> role = sessionService.authenticate(token);
            if (role.isPresent()) {
                UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                    token, null,
                    Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.get())));
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(request, response);
    }
}
