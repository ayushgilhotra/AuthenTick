package com.authentick.controller;

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

    @PostMapping
    public ResponseEntity<?> create(@RequestBody ReportRequest request) {
        Product product = null;
        if (request.getToken() != null && !request.getToken().isEmpty()) {
            product = productRepository.findByToken(request.getToken()).orElse(null);
        }

        Report report = Report.builder()
                .product(product)
                .reason(request.getReason())
                .details(request.getDetails())
                .reporterEmail(request.getReporterEmail())
                .status(Report.ReportStatus.PENDING)
                .build();
        reportRepository.save(report);

        return ResponseEntity.ok(Map.of("message", "Report submitted successfully"));
    }

    @GetMapping
    public ResponseEntity<?> list() {
        List<Report> reports = reportRepository.findAllByOrderByCreatedAtDesc();
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
