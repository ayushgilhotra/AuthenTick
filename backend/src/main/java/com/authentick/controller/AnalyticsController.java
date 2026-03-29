package com.authentick.controller;

import com.authentick.model.*;
import com.authentick.repository.*;
import com.authentick.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final MedicineRepository medicineRepository;
    private final BatchRepository batchRepository;
    private final ScanLogRepository scanLogRepository;
    private final ProductRepository productRepository;
    private final ReportRepository reportRepository;
    private final AuthService authService;

    @GetMapping("/stats")
    public ResponseEntity<?> stats(Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());

        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("totalMedicines", medicineRepository.countByUser(user));
        stats.put("totalBatches", batchRepository.countByUser(user));
        stats.put("totalScans", scanLogRepository.countByUserId(user.getId()));
        stats.put("totalReports", reportRepository.countByUserId(user.getId()));
        
        // Custom query for duplicates (products with scanCount > 1)
        long duplicates = productRepository.countByBatchUserAndScanCountGreaterThan(user, 1);
        stats.put("duplicateScans", duplicates);

        return ResponseEntity.ok(stats);
    }

    @GetMapping("/scans")
    public ResponseEntity<?> scanActivity(Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        List<Object[]> data = scanLogRepository.getScanActivityByUser(user.getId());

        List<Map<String, Object>> result = new ArrayList<>();
        for (Object[] row : data) {
            Map<String, Object> entry = new LinkedHashMap<>();
            entry.put("date", row[0] != null ? row[0].toString() : "");
            entry.put("scans", row[1]);
            result.add(entry);
        }

        return ResponseEntity.ok(result);
    }

    @GetMapping("/recent-scans")
    public ResponseEntity<?> recentScans(Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        List<ScanLog> logs = scanLogRepository.findRecentScans();

        List<Map<String, Object>> result = new ArrayList<>();
        int count = 0;
        for (ScanLog log : logs) {
            if (log.getProduct().getBatch().getUser().getId().equals(user.getId())) {
                Map<String, Object> map = new LinkedHashMap<>();
                map.put("id", log.getId());
                map.put("productToken", log.getProduct().getToken());
                map.put("medicineName", log.getProduct().getBatch().getMedicine().getName());
                map.put("location", (log.getCity() != null ? log.getCity() : "") + ", " +
                        (log.getCountry() != null ? log.getCountry() : ""));
                map.put("scannedAt", log.getScannedAt() != null ? log.getScannedAt().toString() : "");
                result.add(map);
                count++;
                if (count >= 20) break;
            }
        }

        return ResponseEntity.ok(result);
    }
}
