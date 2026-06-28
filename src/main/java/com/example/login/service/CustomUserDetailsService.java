package com.example.login.service;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.example.login.entity.AppUser;
import com.example.login.repository.AppUserRepository;

/**
 * Loads users from the {@code users} table for authentication. Spring Security
 * picks this up automatically (it's the only {@link UserDetailsService} bean)
 * and uses it together with the {@code PasswordEncoder} to validate logins.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final AppUserRepository repository;

    public CustomUserDetailsService(AppUserRepository repository) {
        this.repository = repository;
    }

    private static final org.slf4j.Logger log =
        org.slf4j.LoggerFactory.getLogger(CustomUserDetailsService.class);

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = repository.findByUsername(username)
            .orElseThrow(() -> {
                log.warn("Authentication lookup failed: user not found: {}", username);
                return new UsernameNotFoundException("User not found: " + username);
            });

        return User.builder()
            .username(user.getUsername())
            .password(user.getPassword())
            .authorities(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
            .disabled(!user.isEnabled())
            .build();
    }
}
