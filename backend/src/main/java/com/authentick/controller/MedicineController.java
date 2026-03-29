package com.authentick.controller;

import com.authentick.dto.MedicineRequest;
import com.authentick.model.Medicine;
import com.authentick.model.User;
import com.authentick.repository.MedicineRepository;
import com.authentick.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/medicines")
@RequiredArgsConstructor
public class MedicineController {

    private final MedicineRepository medicineRepository;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<?> list(Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        List<Medicine> medicines = medicineRepository.findByUser(user);

        List<Map<String, Object>> result = new ArrayList<>();
        for (Medicine m : medicines) {
            Map<String, Object> map = new LinkedHashMap<>();
            map.put("id", m.getId());
            map.put("name", m.getName());
            map.put("manufacturer", m.getManufacturer());
            map.put("description", m.getDescription());
            map.put("category", m.getCategory());
            map.put("createdAt", m.getCreatedAt() != null ? m.getCreatedAt().toString() : null);
            result.add(map);
        }
        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody MedicineRequest request, Authentication authentication) {
        User user = authService.getUserByEmail(authentication.getName());
        Medicine medicine = Medicine.builder()
                .name(request.getName())
                .manufacturer(request.getManufacturer())
                .description(request.getDescription())
                .category(request.getCategory())
                .user(user)
                .build();
        medicine = medicineRepository.save(medicine);

        Map<String, Object> map = new LinkedHashMap<>();
        map.put("id", medicine.getId());
        map.put("name", medicine.getName());
        map.put("manufacturer", medicine.getManufacturer());
        map.put("description", medicine.getDescription());
        map.put("category", medicine.getCategory());
        map.put("createdAt", medicine.getCreatedAt() != null ? medicine.getCreatedAt().toString() : null);
        return ResponseEntity.ok(map);
    }
}
