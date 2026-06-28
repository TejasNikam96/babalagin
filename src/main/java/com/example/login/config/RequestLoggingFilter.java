package com.example.login.config;

import java.io.IOException;
import java.util.UUID;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Logs one line per HTTP request (method, path, status, duration) and tags every
 * log produced while handling that request with a short correlation id
 * ({@code requestId} in the MDC). This gives automatic execution-log coverage
 * for every endpoint, and lets all logs for a single call be grepped together.
 *
 * <p>API calls ({@code /api/**}) are logged at INFO; static assets and other
 * paths at DEBUG to keep the access log readable.</p>
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestLoggingFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(RequestLoggingFilter.class);
    private static final String REQUEST_ID = "requestId";

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        long start = System.currentTimeMillis();
        String requestId = UUID.randomUUID().toString().substring(0, 8);
        MDC.put(REQUEST_ID, requestId);

        String method = request.getMethod();
        String path = request.getRequestURI();
        boolean isApi = path != null && path.startsWith("/api/");

        try {
            if (isApi) {
                log.info("--> {} {}", method, path);
            } else {
                log.debug("--> {} {}", method, path);
            }
            chain.doFilter(request, response);
        } finally {
            long took = System.currentTimeMillis() - start;
            int status = response.getStatus();
            if (isApi) {
                if (status >= 500) {
                    log.error("<-- {} {} {} ({} ms)", method, path, status, took);
                } else if (status >= 400) {
                    log.warn("<-- {} {} {} ({} ms)", method, path, status, took);
                } else {
                    log.info("<-- {} {} {} ({} ms)", method, path, status, took);
                }
            } else {
                log.debug("<-- {} {} {} ({} ms)", method, path, status, took);
            }
            MDC.remove(REQUEST_ID);
        }
    }
}
