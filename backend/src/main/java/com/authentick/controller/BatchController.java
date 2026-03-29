package com.authentick.controller;

import com.authentick.dto.BatchRequest;
import com.authentick.model.*;
import com.authentick.repository.*;
import com.authentick.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api/batches")
@RequiredArgsConstructor
public class BatchController {

    private final BatchRepository batchRepository;
    private final MedicineRepository medicineRepository;
    private final ProductRepository productRepository;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<?> list(Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        List<Batch> batches = batchRepository.findByUser(user);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Batch b : batches) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", b.getId());
            map.put("batchNumber", b.getBatchNumber());
            map.put("medicineName", b.getMedicine().getName());
            map.put("medicineId", b.getMedicine().getId());
            map.put("manufactureDate", b.getManufactureDate() != null ? b.getManufactureDate().toString() : null);
            map.put("expiryDate", b.getExpiryDate() != null ? b.getExpiryDate().toString() : null);
            map.put("quantity", b.getQuantity());
            map.put("isRecalled", b.getIsRecalled());
            map.put("productCount", productRepository.countByBatch(b));
            map.put("createdAt", b.getCreatedAt() != null ? b.getCreatedAt().toString() : null);
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody BatchRequest request, Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        Medicine medicine = medicineRepository.findById(request.getMedicineId())
                .orElseThrow(() -> new RuntimeException("Medicine not found"));

        Batch batch = Batch.builder()
                .medicine(medicine)
                .batchNumber(request.getBatchNumber())
                .manufactureDate(LocalDate.parse(request.getManufactureDate()))
                .expiryDate(LocalDate.parse(request.getExpiryDate()))
                .quantity(request.getQuantity())
                .isRecalled(false)
                .user(user)
                .build();
        batch = batchRepository.save(batch);

        // Auto-generate product tokens
        List<Map<String, Object>> products = new ArrayList<>();
        for (int i = 0; i < request.getQuantity(); i++) {
            String rawToken = UUID.randomUUID().toString();
            String hashedToken;
            try {
                hashedToken = java.util.Base64.getEncoder().encodeToString(
                    java.security.MessageDigest.getInstance("MD5").digest(rawToken.getBytes())
                ).substring(0, 16);
            } catch (java.security.NoSuchAlgorithmException e) {
                hashedToken = rawToken.substring(0, 16); // Fallback
            }
            
            String tokenId = "AT-" + batch.getId() + "-" + (i + 1);
            
            // Structured QR Data: BatchID|ProductID|HashedToken
            String qrData = String.format("B%d|P%d|%s", batch.getId(), i + 1, hashedToken);

            Product product = Product.builder()
                    .batch(batch)
                    .token(hashedToken) // Store the hashed comparison token
                    .qrData(qrData)
                    .scanCount(0)
                    .build();
            product = productRepository.save(product);

            Map<String, Object> pMap = new LinkedHashMap<>();
            pMap.put("id", product.getId());
            pMap.put("token_id", tokenId);
            pMap.put("token", hashedToken);
            products.add(pMap);
        }

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("id", batch.getId());
        result.put("batchNumber", batch.getBatchNumber());
        result.put("medicineName", medicine.getName());
        result.put("quantity", batch.getQuantity());
        result.put("products", products);

        return ResponseEntity.ok(result);
    }
}
