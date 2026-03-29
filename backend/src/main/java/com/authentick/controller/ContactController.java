package com.authentick.controller;

import com.authentick.dto.ContactRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/contact")
@RequiredArgsConstructor
public class ContactController {

    @PostMapping
    public ResponseEntity<?> submit(@RequestBody ContactRequest request) {
        // In production, send email or save to DB
        // For now, just acknowledge
        return ResponseEntity.ok(Map.of(
                "message", "Thank you for contacting us! We'll get back to you soon.",
                "name", request.getName()
        ));
    }
}
