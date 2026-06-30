package com.example.login.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.login.security.TokenAuthenticationFilter;
import com.example.login.service.LikeService;
import com.example.login.service.SessionService;

/**
 * Profile-likes API.
 * <ul>
 *   <li>Anyone sees the total like count.</li>
 *   <li>A logged-in user likes/un-likes (identity taken from the session token,
 *       not the request body).</li>
 *   <li>Only the profile owner can see the list of who liked them.</li>
 * </ul>
 */
@RestController
@RequestMapping("/api/likes")
@CrossOrigin
public class LikeController {

    private final LikeService likeService;
    private final SessionService sessionService;

    public LikeController(LikeService likeService, SessionService sessionService) {
        this.likeService = likeService;
        this.sessionService = sessionService;
    }

    /** Total like count for a profile, plus whether the caller (token) has liked it. */
    @GetMapping("/status")
    public Map<String, Object> status(@RequestParam("code") String code,
            @RequestHeader(value = TokenAuthenticationFilter.HEADER, required = false) String token) {
        Map<String, Object> body = new HashMap<>();
        body.put("count", likeService.count(code));
        boolean liked = false;
        Optional<String> me = sessionService.principalOf(token);
        if (me.isPresent()) {
            liked = likeService.hasLiked(me.get(), code);
        }
        body.put("liked", liked);
        return body;
    }

    /** Toggle the caller's like for a profile. Caller identity comes from the token. */
    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Object>> toggle(@RequestBody Map<String, String> req,
            @RequestHeader(value = TokenAuthenticationFilter.HEADER, required = false) String token) {
        Optional<String> me = sessionService.principalOf(token);
        if (!me.isPresent()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(msg("Please log in to like a profile."));
        }
        String from = me.get();
        String to = req.get("code");
        if (to == null || to.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(msg("Target code is required."));
        }
        if (from.equals(to)) {
            return ResponseEntity.badRequest().body(msg("You cannot like your own profile."));
        }
        boolean liked = likeService.toggle(from, to);
        Map<String, Object> body = new HashMap<>();
        body.put("liked", liked);
        body.put("count", likeService.count(to));
        return ResponseEntity.ok(body);
    }

    /** The list of registration codes who liked the caller's own profile (owner-only). */
    @GetMapping("/mine")
    public ResponseEntity<Map<String, Object>> mine(
            @RequestHeader(value = TokenAuthenticationFilter.HEADER, required = false) String token) {
        Optional<String> me = sessionService.principalOf(token);
        if (!me.isPresent()) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Map<String, Object> body = new HashMap<>();
        body.put("count", likeService.count(me.get()));
        body.put("likers", likeService.likers(me.get()));
        return ResponseEntity.ok(body);
    }

    private Map<String, Object> msg(String m) {
        Map<String, Object> x = new HashMap<>();
        x.put("message", m);
        return x;
    }
}
