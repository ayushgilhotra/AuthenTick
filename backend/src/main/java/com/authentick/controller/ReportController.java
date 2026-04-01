package com.authentick.controller;

import com.authentick.config.JwtUtil;
import com.authentick.dto.ReportRequest;
import com.authentick.model.*;
import com.authentick.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportRepository reportRepository;
    private final ProductRepository productRepository;
    private final JwtUtil jwtUtil;

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ReportRequest request, @RequestHeader(value = "Authorization", required = false) String authHeader) {
        Product product = null;
        if (request.getToken() != null && !request.getToken().isEmpty()) {
            product = productRepository.findByToken(request.getToken()).orElse(null);
        }

        Long userId = null;
        String reporterEmail = request.getReporterEmail();

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                String jwt = authHeader.substring(7);
                if (jwtUtil.validateToken(jwt)) {
                    userId = jwtUtil.getUserIdFromToken(jwt);
                    if (reporterEmail == null || reporterEmail.isEmpty()) {
                        reporterEmail = jwtUtil.getEmailFromToken(jwt);
                    }
                }
            } catch (Exception e) {}
        }

        Report report = Report.builder()
                .product(product)
                .reason(request.getReason())
                .details(request.getDetails())
                .reporterEmail(reporterEmail)
                .userId(userId)
                .status(Report.ReportStatus.PENDING)
                .build();
        reportRepository.save(report);

        return ResponseEntity.ok(Map.of("message", "Report submitted successfully"));
    }

    @GetMapping
    public ResponseEntity<?> list(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        String jwt = authHeader.substring(7);
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }

        String role = jwtUtil.getRoleFromToken(jwt);
        Long userId = jwtUtil.getUserIdFromToken(jwt);

        List<Report> reports;
        if ("ADMIN".equals(role)) {
            reports = reportRepository.findAllByOrderByCreatedAtDesc();
        } else {
            reports = reportRepository.findByUserIdOrderByCreatedAtDesc(userId);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (Report r : reports) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", r.getId());
            map.put("reason", r.getReason());
            map.put("details", r.getDetails());
            map.put("reporterEmail", r.getReporterEmail());
            map.put("status", r.getStatus().name());
            map.put("productToken", r.getProduct() != null ? r.getProduct().getToken() : "N/A");
            map.put("createdAt", r.getCreatedAt() != null ? r.getCreatedAt().toString() : null);
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }
}
