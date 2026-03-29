package com.authentick.service;

import com.authentick.dto.VerifyResponse;
import com.authentick.model.*;
import com.authentick.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
@RequiredArgsConstructor
public class VerifyService {

    private final ProductRepository productRepository;
    private final ScanLogRepository scanLogRepository;

    public VerifyResponse verify(String token, String ipAddress, String userAgent) {
        Optional<Product> productOpt = productRepository.findByToken(token);

        if (productOpt.isEmpty()) {
            return VerifyResponse.builder()
                    .status("invalid")
                    .message("No product found with this token. The medicine may be counterfeit.")
                    .build();
        }

        Product product = productOpt.get();
        Batch batch = product.getBatch();
        Medicine medicine = batch.getMedicine();

        // Check recalled
        if (Boolean.TRUE.equals(batch.getIsRecalled())) {
            logScan(product, ipAddress, userAgent);
            return buildResponse(product, medicine, batch, "recalled",
                    "This medicine has been recalled by the manufacturer. Please stop using it immediately.");
        }

        // Check expiry
        if (batch.getExpiryDate() != null && batch.getExpiryDate().isBefore(LocalDate.now())) {
            logScan(product, ipAddress, userAgent);
            return buildResponse(product, medicine, batch, "expired",
                    "This medicine has expired. Do not use it.");
        }

        // Check duplicate (flag immediately if scanned before)
        if (product.getScanCount() != null && product.getScanCount() > 0) {
            logScan(product, ipAddress, userAgent);
            return buildResponse(product, medicine, batch, "suspicious",
                    "DUPLICATE SCAN DETECTED. This product was already verified on " + 
                    product.getCreatedAt().toLocalDate() + ". It may be a duplicate.");
        }

        // Genuine
        logScan(product, ipAddress, userAgent);
        return buildResponse(product, medicine, batch, "genuine",
                "This medicine is verified as genuine.");
    }

    private void logScan(Product product, String ipAddress, String userAgent) {
        // Get location from IP
        String city = "Unknown";
        String country = "Unknown";
        try {
            RestTemplate restTemplate = new RestTemplate();
            @SuppressWarnings("unchecked")
            Map<String, Object> geoData = restTemplate.getForObject(
                    "http://ip-api.com/json/" + ipAddress + "?fields=city,country", Map.class);
            if (geoData != null) {
                city = (String) geoData.getOrDefault("city", "Unknown");
                country = (String) geoData.getOrDefault("country", "Unknown");
            }
        } catch (Exception e) {
            // Silently handle - use defaults
        }

        // Basic Device Detection
        String deviceType = "Desktop";
        if (userAgent != null) {
            String uaLower = userAgent.toLowerCase();
            if (uaLower.contains("mobile") || uaLower.contains("android") || uaLower.contains("iphone")) {
                deviceType = "Mobile";
            } else if (uaLower.contains("tablet") || uaLower.contains("ipad")) {
                deviceType = "Tablet";
            }
        }

        ScanLog log = ScanLog.builder()
                .product(product)
                .ipAddress(ipAddress)
                .city(city)
                .country(country)
                .userAgent(userAgent)
                .deviceType(deviceType)
                .build();
        scanLogRepository.save(log);

        // Update product scan count and location
        product.setScanCount((product.getScanCount() != null ? product.getScanCount() : 0) + 1);
        product.setLastScanLocation(city + ", " + country);
        productRepository.save(product);
    }

    private VerifyResponse buildResponse(Product product, Medicine medicine, Batch batch,
                                         String status, String message) {
        List<ScanLog> logs = scanLogRepository.findByProductOrderByScannedAtDesc(product);
        List<Map<String, String>> timeline = new ArrayList<>();

        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        for (ScanLog log : logs) {
            Map<String, String> entry = new HashMap<>();
            entry.put("date", log.getScannedAt() != null ? log.getScannedAt().format(fmt) : "");
            entry.put("location", (log.getCity() != null ? log.getCity() : "") + ", " +
                    (log.getCountry() != null ? log.getCountry() : ""));
            entry.put("ip", log.getIpAddress() != null ? log.getIpAddress() : "");
            timeline.add(entry);
        }

        return VerifyResponse.builder()
                .status(status)
                .message(message)
                .medicineName(medicine.getName())
                .manufacturer(medicine.getManufacturer())
                .batchNumber(batch.getBatchNumber())
                .expiryDate(batch.getExpiryDate() != null ? batch.getExpiryDate().toString() : "N/A")
                .manufactureDate(batch.getManufactureDate() != null ? batch.getManufactureDate().toString() : "N/A")
                .category(medicine.getCategory())
                .scanCount(product.getScanCount() != null ? product.getScanCount() : 0)
                .lastScanLocation(product.getLastScanLocation())
                .scanTimeline(timeline)
                .build();
    }
}
