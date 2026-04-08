package com.authentick.service;

import com.authentick.model.AuditLog;
import com.authentick.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public void log(Long userId, String userRole, String action, String description,
                    String entityType, Long entityId, String ipAddress) {
        AuditLog entry = AuditLog.builder()
                .userId(userId)
                .userRole(userRole)
                .action(action)
                .description(description)
                .entityType(entityType)
                .entityId(entityId)
                .ipAddress(ipAddress)
                .build();
        auditLogRepository.save(entry);
        log.info("AUDIT: [{}] {} — {} (entity: {}:{})", userRole, action, description, entityType, entityId);
    }

    public void logSystem(String action, String description, String entityType, Long entityId) {
        log(null, "SYSTEM", action, description, entityType, entityId, null);
    }
}
