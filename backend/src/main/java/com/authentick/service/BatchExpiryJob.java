package com.authentick.service;

import com.authentick.model.Batch;
import com.authentick.model.Notification;
import com.authentick.repository.BatchRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class BatchExpiryJob {

    private final BatchRepository batchRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    /**
     * Runs daily at 9:00 AM.
     * Checks all active batches for expiry within 7 days and already expired batches.
     */
    @Scheduled(cron = "0 0 9 * * *")
    @Transactional
    public void checkBatchExpiry() {
        log.info("⏰ Batch Expiry Cron Job started at {}", LocalDateTime.now());

        LocalDate today = LocalDate.now();
        LocalDate sevenDaysFromNow = today.plusDays(7);

        // Find batches expiring within 7 days that haven't been notified
        List<Batch> expiringSoon = batchRepository.findBatchesExpiringSoon(sevenDaysFromNow);
        for (Batch batch : expiringSoon) {
            if (batch.getExpiryDate().isAfter(today) && !Boolean.TRUE.equals(batch.getExpiryNotified())) {
                batch.setStatus(Batch.BatchStatus.EXPIRING_SOON);
                batch.setExpiryNotified(true);
                batchRepository.save(batch);

                Long ownerId = batch.getUser() != null ? batch.getUser().getId() : null;
                if (ownerId != null) {
                    notificationService.create(ownerId,
                            Notification.NotificationType.EXPIRY_WARNING,
                            "Batch Expiring Soon",
                            "Batch " + batch.getBatchNumber() + " expires on " + batch.getExpiryDate() + ". Take action now.",
                            batch.getId(), "BATCH");
                }

                auditLogService.logSystem("EXPIRY_WARNING",
                        "Batch " + batch.getBatchNumber() + " is expiring on " + batch.getExpiryDate(),
                        "BATCH", batch.getId());

                log.info("⚠️ Batch {} marked as EXPIRING_SOON", batch.getBatchNumber());
            }
        }

        // Find expired batches
        List<Batch> expired = batchRepository.findExpiredBatches(today);
        for (Batch batch : expired) {
            if (!Boolean.TRUE.equals(batch.getExpiredNotified())) {
                batch.setStatus(Batch.BatchStatus.EXPIRED);
                batch.setExpiredNotified(true);
                batchRepository.save(batch);

                Long ownerId = batch.getUser() != null ? batch.getUser().getId() : null;
                if (ownerId != null) {
                    notificationService.create(ownerId,
                            Notification.NotificationType.BATCH_EXPIRED,
                            "Batch Expired",
                            "Batch " + batch.getBatchNumber() + " has expired as of " + batch.getExpiryDate() + ".",
                            batch.getId(), "BATCH");
                }

                auditLogService.logSystem("BATCH_EXPIRED",
                        "Batch " + batch.getBatchNumber() + " auto‑expired",
                        "BATCH", batch.getId());

                log.info("🔴 Batch {} marked as EXPIRED", batch.getBatchNumber());
            }
        }

        log.info("✅ Batch Expiry Cron Job completed. Expiring: {}, Expired: {}",
                expiringSoon.size(), expired.size());
    }
}
