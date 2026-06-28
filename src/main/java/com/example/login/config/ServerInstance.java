package com.example.login.config;

import java.util.UUID;

import org.springframework.stereotype.Component;

/**
 * Holds a unique id generated once per JVM run. The frontend remembers the id
 * it logged in under and logs the user out if the id changes (i.e. the server
 * was restarted), so profile sessions don't survive a restart.
 */
@Component
public class ServerInstance {

    private final String id = UUID.randomUUID().toString();

    public String getId() {
        return id;
    }
}
