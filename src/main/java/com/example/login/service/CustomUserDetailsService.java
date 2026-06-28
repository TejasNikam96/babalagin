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

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = repository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));

        return User.builder()
            .username(user.getUsername())
            .password(user.getPassword())
            .authorities(new SimpleGrantedAuthority("ROLE_" + user.getRole()))
            .disabled(!user.isEnabled())
            .build();
    }
}
