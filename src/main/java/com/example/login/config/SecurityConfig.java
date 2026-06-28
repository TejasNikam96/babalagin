package com.example.login.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.example.login.security.TokenAuthenticationFilter;
import com.example.login.service.SessionService;

/**
 * Security configuration.
 *
 * <p>The frontend is the React single-page app (served from
 * {@code resources/static}) with its own login UI. Authentication is
 * token-based: admins sign in at {@code POST /api/admin/login} and receive a
 * server-side session token (see {@link SessionService}) that is sent as the
 * {@code X-Auth-Token} header on subsequent admin requests and validated by
 * {@link TokenAuthenticationFilter}. Sessions carry a 30-minute idle timeout,
 * so HTTP Basic (which re-sends credentials every request and never expires) is
 * intentionally not used.</p>
 */
@Configuration
public class SecurityConfig {

    private final SessionService sessionService;

    public SecurityConfig(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // The SPA is a static client; CSRF tokens aren't applicable yet.
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authorize -> authorize
                // Public auth/session endpoints (token is issued / checked here).
                .antMatchers("/api/admin/login", "/api/session/**").permitAll()
                // Admin-only operations (require a valid admin session token).
                .antMatchers(HttpMethod.PUT, "/api/payment/*/status").hasRole("ADMIN")
                .antMatchers(HttpMethod.GET, "/api/payment", "/api/payment/**",
                                             "/api/registration", "/api/registration/**").hasRole("ADMIN")
                .antMatchers("/api/admin/**").hasRole("ADMIN")
                // Returns the current token's identity/roles.
                .antMatchers("/api/auth/me").authenticated()
                // Everything else (the SPA, registration POST, payment POST) is open.
                .anyRequest().permitAll()
            )
            // Allow framing same-origin so the H2 console (dev profile) renders.
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            // No server-rendered login page; React handles its own UI.
            .formLogin(form -> form.disable())
            .httpBasic(basic -> basic.disable())
            // Return 401 (not a redirect/403) when an admin token is missing/expired.
            .exceptionHandling(ex -> ex.authenticationEntryPoint(
                new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED)))
            // Validate the X-Auth-Token header on every request.
            .addFilterBefore(new TokenAuthenticationFilter(sessionService),
                             UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
