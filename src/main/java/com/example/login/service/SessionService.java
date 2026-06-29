package com.example.login.service;

import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

/**
 * Server-side session store with an inactivity (idle) timeout.
 *
 * <p>This is the authoritative source of truth for whether a login is still
 * valid. A token is issued at login and must accompany subsequent requests.
 * A session expires when no activity is seen for {@link #IDLE_TIMEOUT_MS}
 * (30 minutes); the next request/check is then rejected and the client logs
 * out. The store is in-memory, so a server restart also invalidates every
 * session.</p>
 *
 * <p>Activity is recorded explicitly via {@link #touch(String)} (a heartbeat
 * fired by the client on real user interaction). Read-only checks
 * ({@link #authenticate(String)} / {@link #isValid(String)}) deliberately do
 * <em>not</em> extend the window, so periodic validation polling can't keep a
 * truly idle session alive.</p>
 */
@Service
public class SessionService {

    private static final Logger log = LoggerFactory.getLogger(SessionService.class);

    /** Idle timeout: log out after 30 minutes without activity. */
    public static final long IDLE_TIMEOUT_MS = 30 * 60 * 1000L;

    private static final class Session {
        final String principal;
        final String role; // e.g. "ADMIN" or "PROFILE"
        volatile long lastAccess;

        Session(String principal, String role, long now) {
            this.principal = principal;
            this.role = role;
            this.lastAccess = now;
        }
    }

    private final ConcurrentHashMap<String, Session> sessions = new ConcurrentHashMap<>();

    /** Creates a new session and returns its opaque token. */
    public String create(String principal, String role) {
        sweepExpired();
        String token = UUID.randomUUID().toString().replace("-", "");
        sessions.put(token, new Session(principal, role, System.currentTimeMillis()));
        log.debug("Session created: principal={}, role={}, activeSessions={}", principal, role, sessions.size());
        return token;
    }

    /**
     * Returns the session's role if the token is live (not idle-expired), WITHOUT
     * extending the window. Removes the entry if it has expired.
     */
    public Optional<String> authenticate(String token) {
        if (token == null) return Optional.empty();
        Session s = sessions.get(token);
        if (s == null) return Optional.empty();
        if (isExpired(s)) {
            sessions.remove(token);
            log.info("Session expired (idle timeout) for principal={}", s.principal);
            return Optional.empty();
        }
        return Optional.of(s.role);
    }

    /** Read-only liveness check (does not extend the window). */
    public boolean isValid(String token) {
        return authenticate(token).isPresent();
    }

    /** The principal (e.g. registrationCode) for a live token, without extending it. */
    public Optional<String> principalOf(String token) {
        if (token == null) return Optional.empty();
        Session s = sessions.get(token);
        if (s == null) return Optional.empty();
        if (isExpired(s)) {
            sessions.remove(token);
            return Optional.empty();
        }
        return Optional.of(s.principal);
    }

    /**
     * Records activity: extends the idle window if the session is still live.
     * Returns false (and removes the entry) if it was already expired/unknown.
     */
    public boolean touch(String token) {
        if (token == null) return false;
        Session s = sessions.get(token);
        if (s == null) return false;
        if (isExpired(s)) {
            sessions.remove(token);
            log.info("Session expired (idle timeout) on heartbeat for principal={}", s.principal);
            return false;
        }
        s.lastAccess = System.currentTimeMillis();
        return true;
    }

    /** Explicit logout. */
    public void invalidate(String token) {
        if (token != null) sessions.remove(token);
    }

    private boolean isExpired(Session s) {
        return System.currentTimeMillis() - s.lastAccess > IDLE_TIMEOUT_MS;
    }

    /** Opportunistically drop expired entries so the map can't grow unbounded. */
    private void sweepExpired() {
        long now = System.currentTimeMillis();
        sessions.entrySet().removeIf(e -> now - e.getValue().lastAccess > IDLE_TIMEOUT_MS);
    }
}
