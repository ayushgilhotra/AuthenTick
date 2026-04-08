package com.authentick.controller;

import com.authentick.config.JwtUtil;
import com.authentick.model.AuditLog;
import com.authentick.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/audit-logs")
@RequiredArgsConstructor
public class AuditLogController {

    private final AuditLogRepository auditLogRepository;
    private final JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> list(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size,
            @RequestParam(required = false) String action,
            @RequestHeader("Authorization") String authHeader) {

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));
        }

        String jwt = authHeader.substring(7);
        if (!jwtUtil.validateToken(jwt)) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid token"));
        }

        String role = jwtUtil.getRoleFromToken(jwt);
        Long userId = jwtUtil.getUserIdFromToken(jwt);

        PageRequest pageRequest = PageRequest.of(page, size);
        Page<AuditLog> logs;

        if ("ADMIN".equals(role)) {
            if (action != null && !action.isEmpty()) {
                logs = auditLogRepository.findByActionContainingIgnoreCaseOrderByCreatedAtDesc(action, pageRequest);
            } else {
                logs = auditLogRepository.findAllByOrderByCreatedAtDesc(pageRequest);
            }
        } else {
            logs = auditLogRepository.findByUserIdOrderByCreatedAtDesc(userId, pageRequest);
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (AuditLog al : logs.getContent()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", al.getId());
            m.put("userId", al.getUserId());
            m.put("userRole", al.getUserRole());
            m.put("action", al.getAction());
            m.put("description", al.getDescription());
            m.put("entityType", al.getEntityType());
            m.put("entityId", al.getEntityId());
            m.put("ipAddress", al.getIpAddress());
            m.put("createdAt", al.getCreatedAt() != null ? al.getCreatedAt().toString() : null);
            result.add(m);
        }

        Map<String, Object> response = new LinkedHashMap<>();
        response.put("content", result);
        response.put("totalPages", logs.getTotalPages());
        response.put("totalElements", logs.getTotalElements());
        response.put("currentPage", logs.getNumber());

        return ResponseEntity.ok(response);
    }
}
