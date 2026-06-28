package com.example.login.config;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Makes the SPA's HTML document non-cacheable so a browser always picks up the
 * latest build after a redeploy.
 *
 * <p>The React build emits content-hashed assets (e.g. {@code main.<hash>.js})
 * that are safe to cache forever, but {@code index.html} references those hashes
 * and must NOT be cached -- otherwise the browser keeps loading an old bundle
 * (which caused stale admin-login behaviour). This filter adds no-cache headers
 * to the root, {@code index.html}, and extension-less SPA routes (which
 * SpaController forwards to index.html), while leaving {@code /static/**},
 * {@code /api/**} and real files (with a dot) untouched.</p>
 */
@Component
@Order(Ordered.HIGHEST_PRECEDENCE + 5)
public class NoCacheHtmlFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
                                    FilterChain chain) throws ServletException, IOException {
        String path = request.getRequestURI();
        if (isHtmlDocument(path)) {
            response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
            response.setHeader("Pragma", "no-cache");
            response.setHeader("Expires", "0");
        }
        chain.doFilter(request, response);
    }

    private boolean isHtmlDocument(String path) {
        if (path == null) return false;
        if (path.equals("/") || path.equals("/index.html")) return true;
        // SPA client-side routes: no file extension, and not API/asset paths.
        return !path.startsWith("/api/")
            && !path.startsWith("/static/")
            && !path.contains(".");
    }
}
