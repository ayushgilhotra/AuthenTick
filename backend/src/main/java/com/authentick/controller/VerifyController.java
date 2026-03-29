package com.authentick.controller;

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

    @GetMapping("/{token}")
    public ResponseEntity<?> verify(@PathVariable String token, HttpServletRequest request) {
        String ipAddress = request.getHeader("X-Forwarded-For");
        if (ipAddress == null || ipAddress.isEmpty()) {
            ipAddress = request.getRemoteAddr();
        }
        String userAgent = request.getHeader("User-Agent");
        return ResponseEntity.ok(verifyService.verify(token, ipAddress, userAgent));
    }
}
