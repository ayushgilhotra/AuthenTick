package com.authentick.repository;

import com.authentick.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findAllByOrderByCreatedAtDesc();
    List<Report> findByUserIdOrderByCreatedAtDesc(Long userId);

    @Query("SELECT COUNT(r) FROM Report r WHERE r.product.batch.user.id = :userId")
    long countByUserId(@Param("userId") Long userId);

    @Query("SELECT COUNT(r) FROM Report r WHERE r.product.batch.id = :batchId AND r.createdAt >= :since")
    long countByBatchIdSince(@Param("batchId") Long batchId, @Param("since") LocalDateTime since);
}
