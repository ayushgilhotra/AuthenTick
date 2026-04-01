package com.authentick.controller;

import com.authentick.config.JwtUtil;
import com.authentick.model.ScanLog;
import com.authentick.repository.ScanLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/scan-history")
@RequiredArgsConstructor
public class ScanHistoryController {

    private final ScanLogRepository scanLogRepository;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> getScanHistory(Authentication authentication,
                                            @RequestHeader("Authorization") String authHeader) {
        if (authentication == null) {
            return ResponseEntity.status(401).body(Map.of("error", "Not authenticated"));
        }

        Long userId = null;
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            try {
                userId = jwtUtil.getUserIdFromToken(authHeader.substring(7));
            } catch (Exception e) {
                return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
            }
        }

        if (userId == null) {
            return ResponseEntity.status(401).body(Map.of("error", "User not found"));
        }

        List<ScanLog> logs = scanLogRepository.findByUserIdOrderByScannedAtDesc(userId);
        List<Map<String, Object>> result = new ArrayList<>();

        for (ScanLog log : logs) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("id", log.getId());
            entry.put("scannedAt", log.getScannedAt() != null ? log.getScannedAt().toString() : "");
            entry.put("city", log.getCity());
            entry.put("country", log.getCountry());
            entry.put("deviceType", log.getDeviceType());

            // Get product and medicine info
            if (log.getProduct() != null) {
                entry.put("token", log.getProduct().getToken());
                entry.put("scanCount", log.getProduct().getScanCount());
                if (log.getProduct().getBatch() != null) {
                    entry.put("batchNumber", log.getProduct().getBatch().getBatchNumber());
                    entry.put("expiryDate", log.getProduct().getBatch().getExpiryDate() != null ?
                            log.getProduct().getBatch().getExpiryDate().toString() : "N/A");
                    entry.put("isRecalled", log.getProduct().getBatch().getIsRecalled());
                    if (log.getProduct().getBatch().getMedicine() != null) {
                        entry.put("medicineName", log.getProduct().getBatch().getMedicine().getName());
                        entry.put("manufacturer", log.getProduct().getBatch().getMedicine().getManufacturer());
                        entry.put("category", log.getProduct().getBatch().getMedicine().getCategory());
                    }
                }
            }

            // Determine status
            String status = "genuine";
            if (log.getProduct() != null && log.getProduct().getBatch() != null) {
                if (Boolean.TRUE.equals(log.getProduct().getBatch().getIsRecalled())) {
                    status = "recalled";
                } else if (log.getProduct().getBatch().getExpiryDate() != null &&
                        log.getProduct().getBatch().getExpiryDate().isBefore(java.time.LocalDate.now())) {
                    status = "expired";
                } else if (log.getProduct().getScanCount() != null && log.getProduct().getScanCount() > 1) {
                    status = "suspicious";
                }
            }
            entry.put("status", status);

            result.add(entry);
        }

        return ResponseEntity.ok(result);
    }
}
