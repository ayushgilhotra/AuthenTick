package com.authentick.controller;

import com.authentick.model.*;
import com.authentick.repository.*;
import com.authentick.service.AuthService;
import com.authentick.service.QrCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductRepository productRepository;
    private final BatchRepository batchRepository;
    private final QrCodeService qrCodeService;
    private final AuthService authService;

    @GetMapping("/batch/{batchId}")
    public ResponseEntity<?> listByBatch(@PathVariable Long batchId, Authentication authentication) {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        List<Product> products = productRepository.findByBatch(batch);
        List<Map<String, Object>> result = new ArrayList<>();
        for (Product p : products) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", p.getId());
            map.put("token", p.getToken());
            map.put("scanCount", p.getScanCount());
            map.put("lastScanLocation", p.getLastScanLocation());
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @GetMapping("/qr/{id}")
    public ResponseEntity<?> getQrCode(@PathVariable Long id, Authentication authentication) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        String qrBase64 = qrCodeService.generateQrCodeBase64(product.getToken());

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("token", product.getToken());
        result.put("qrCode", "data:image/png;base64," + qrBase64);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/batch/{batchId}/download")
    public void downloadBatchQrs(@PathVariable Long batchId, jakarta.servlet.http.HttpServletResponse response) throws java.io.IOException {
        Batch batch = batchRepository.findById(batchId)
                .orElseThrow(() -> new RuntimeException("Batch not found"));

        List<Product> products = productRepository.findByBatch(batch);
        
        response.setContentType("application/zip");
        response.setHeader("Content-Disposition", "attachment; filename=\"Batch_" + batch.getBatchNumber() + "_QRs.zip\"");
        
        try (java.util.zip.ZipOutputStream zos = new java.util.zip.ZipOutputStream(response.getOutputStream())) {
            for (int i = 0; i < products.size(); i++) {
                Product p = products.get(i);
                String label = String.format("P%d | B:%s | EXP:%s", 
                    i + 1, batch.getBatchNumber(), 
                    batch.getExpiryDate() != null ? batch.getExpiryDate().toString() : "N/A");
                
                byte[] qrImage = qrCodeService.generateQrCodeWithLabel(p.getQrData(), label);
                
                java.util.zip.ZipEntry entry = new java.util.zip.ZipEntry("Product_" + (i+1) + ".png");
                zos.putNextEntry(entry);
                zos.write(qrImage);
                zos.closeEntry();
            }
            zos.finish();
        }
    }
}
