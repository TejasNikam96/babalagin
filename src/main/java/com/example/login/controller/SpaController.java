package com.example.login.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

/**
 * Serves the React single-page application.
 *
 * <p>The compiled React build lives in {@code src/main/resources/static}, so
 * {@code index.html} is served at the root automatically. The React app uses
 * BrowserRouter, which means client-side routes like {@code /rules} or
 * {@code /login} have no server mapping. This controller forwards any such
 * "extension-less" path back to {@code index.html} so the React router can
 * handle it (and a browser refresh on a deep link still works).</p>
 *
 * <p>The {@code [^\.]*} regex deliberately excludes paths containing a dot,
 * so real static files (e.g. {@code /static/js/main.js}, {@code /favicon.ico})
 * are still served by Spring's resource handler instead of being forwarded.</p>
 */
@Controller
public class SpaController {

    @GetMapping(value = {"/{path:[^\\.]*}", "/**/{path:[^\\.]*}"})
    public String forward() {
        return "forward:/index.html";
    }
}
