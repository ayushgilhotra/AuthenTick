package com.authentick.controller;

import com.authentick.config.JwtUtil;
import com.authentick.service.VerifyService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/verify")
@RequiredArgsConstructor
public class VerifyController {

    private final VerifyService verifyService;
    private final JwtUtil jwtUtil;

    @GetMapping("/{token}")
    public ResponseEntity<?> verify(@PathVariable String token, HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }
        String userAgent = request.getHeader("User-Agent");

        // Extract userId from JWT if present (logged-in user)
        Long userId = null;
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String jwt = authHeader.substring(7);
                if (jwtUtil.validateToken(jwt)) {
                    userId = jwtUtil.getUserIdFromToken(jwt);
                }
            } catch (Exception e) {
                // Ignore — treat as guest
            }
        }

        return ResponseEntity.ok(verifyService.verify(token, ipAddress, userAgent, userId));
    }
}
