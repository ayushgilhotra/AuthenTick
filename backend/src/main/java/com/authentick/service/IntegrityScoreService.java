package com.authentick.service;

import com.authentick.model.Batch;
import com.authentick.model.Notification;
import com.authentick.model.Product;
import com.authentick.model.ScanLog;
import com.authentick.repository.BatchRepository;
import com.authentick.repository.ProductRepository;
import com.authentick.repository.ReportRepository;
import com.authentick.repository.ScanLogRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class IntegrityScoreService {

    private final BatchRepository batchRepository;
    private final ProductRepository productRepository;
    private final ScanLogRepository scanLogRepository;
    private final ReportRepository reportRepository;
    private final NotificationService notificationService;
    private final AuditLogService auditLogService;

    private static final int AUTO_RECALL_THRESHOLD = 10;

    /**
     * Recalculate integrity score for a batch after a scan event.
     * Score is 0-100 based on:
     *   - Duplicate scan ratio (products scanned > 1 time)
     *   - Fake report ratio (reports in last 7 days vs total products)
     *   - Clean scan bonus
     */
    @Transactional
    public int recalculate(Long batchId) {
        Batch batch = batchRepository.findById(batchId).orElse(null);
        if (batch == null) return 100;

        List<Product> products = productRepository.findByBatch(batch);
        if (products.isEmpty()) {
            batch.setIntegrityScore(100);
            batchRepository.save(batch);
            return 100;
        }

        int totalProducts = products.size();

        // Duplicate scan penalty: products with scanCount > 1
        long duplicateProducts = products.stream()
                .filter(p -> p.getScanCount() != null && p.getScanCount() > 1)
                .count();
        double duplicateRatio = (double) duplicateProducts / totalProducts;

        // Fake report penalty
        long recentReports = reportRepository.countByBatchIdSince(
                batchId, LocalDateTime.now().minusDays(30));
        double reportRatio = (double) recentReports / totalProducts;

        // Calculate score
        int score = 100;
        score -= (int) (duplicateRatio * 30);  // Max -30 for duplicates
        score -= (int) (reportRatio * 50);      // Max -50 for reports
        score = Math.max(0, Math.min(100, score));

        int previousScore = batch.getIntegrityScore() != null ? batch.getIntegrityScore() : 100;
        batch.setIntegrityScore(score);
        batchRepository.save(batch);

        // Alert if score dropped below 50
        if (score < 50 && previousScore >= 50) {
            Long ownerId = batch.getUser() != null ? batch.getUser().getId() : null;
            if (ownerId != null) {
                notificationService.create(ownerId,
                        Notification.NotificationType.INTEGRITY_DROP,
                        "Integrity Score Critical",
                        "Batch " + batch.getBatchNumber() + " integrity dropped to " + score + "/100. Immediate review recommended.",
                        batch.getId(), "BATCH");

                notificationService.pushDashboardEvent(ownerId, "INTEGRITY_CHANGE",
                        Map.of("batchId", batchId, "score", score, "batchNumber", batch.getBatchNumber()));
            }
        }

        return score;
    }

    /**
     * Check if auto-recall threshold is met for a batch.
     * Called after a new fake report is submitted.
     */
    @Transactional
    public void checkAutoRecall(Long batchId) {
        Batch batch = batchRepository.findById(batchId).orElse(null);
        if (batch == null || Boolean.TRUE.equals(batch.getIsRecalled())) return;
        if (batch.getStatus() == Batch.BatchStatus.RECALLED) return;

        long recentCount = reportRepository.countByBatchIdSince(
                batchId, LocalDateTime.now().minusDays(7));

        if (recentCount >= AUTO_RECALL_THRESHOLD) {
            batch.setIsRecalled(true);
            batch.setStatus(Batch.BatchStatus.RECALLED);
            batchRepository.save(batch);

            Long ownerId = batch.getUser() != null ? batch.getUser().getId() : null;
            if (ownerId != null) {
                notificationService.create(ownerId,
                        Notification.NotificationType.AUTO_RECALL,
                        "Batch Auto‑Recalled",
                        "Batch " + batch.getBatchNumber() + " has been automatically recalled after " + recentCount + " fake reports in 7 days.",
                        batch.getId(), "BATCH");
            }

            auditLogService.logSystem("AUTO_RECALL",
                    "Auto-recalled: " + recentCount + " fake reports received for batch " + batch.getBatchNumber(),
                    "BATCH", batch.getId());

            log.warn("🚨 Batch {} AUTO-RECALLED after {} fake reports", batch.getBatchNumber(), recentCount);
        }
    }
}
