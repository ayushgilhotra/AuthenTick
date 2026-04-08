package com.authentick.controller;

import com.authentick.config.JwtUtil;
import com.authentick.model.Notification;
import com.authentick.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationRepository notificationRepository;
    private final JwtUtil jwtUtil;

    private Long extractUserId(String authHeader) {
        if (authHeader == null || !authHeader.startsWith("Bearer ")) return null;
        String jwt = authHeader.substring(7);
        return jwtUtil.validateToken(jwt) ? jwtUtil.getUserIdFromToken(jwt) : null;
    }

    @GetMapping
    public ResponseEntity<?> getAll(@RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        List<Notification> list = notificationRepository.findByUserIdOrderByCreatedAtDesc(userId);
        return ResponseEntity.ok(list.stream().map(this::toMap).toList());
    }

    @GetMapping("/unread-count")
    public ResponseEntity<?> unreadCount(@RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        long count = notificationRepository.countByUserIdAndIsReadFalse(userId);
        return ResponseEntity.ok(Map.of("count", count));
    }

    @PatchMapping("/{id}/read")
    public ResponseEntity<?> markRead(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        Notification n = notificationRepository.findById(id).orElse(null);
        if (n == null || !n.getUserId().equals(userId)) return ResponseEntity.notFound().build();

        n.setIsRead(true);
        notificationRepository.save(n);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @PatchMapping("/read-all")
    @Transactional
    public ResponseEntity<?> markAllRead(@RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        notificationRepository.markAllReadByUserId(userId);
        return ResponseEntity.ok(Map.of("success", true));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable Long id, @RequestHeader("Authorization") String authHeader) {
        Long userId = extractUserId(authHeader);
        if (userId == null) return ResponseEntity.status(401).body(Map.of("error", "Unauthorized"));

        Notification n = notificationRepository.findById(id).orElse(null);
        if (n == null || !n.getUserId().equals(userId)) return ResponseEntity.notFound().build();

        notificationRepository.delete(n);
        return ResponseEntity.ok(Map.of("success", true));
    }

    private Map<String, Object> toMap(Notification n) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", n.getId());
        m.put("type", n.getType().name());
        m.put("title", n.getTitle());
        m.put("message", n.getMessage());
        m.put("isRead", n.getIsRead());
        m.put("relatedEntityId", n.getRelatedEntityId());
        m.put("relatedEntityType", n.getRelatedEntityType());
        m.put("createdAt", n.getCreatedAt() != null ? n.getCreatedAt().toString() : null);
        return m;
    }
}
