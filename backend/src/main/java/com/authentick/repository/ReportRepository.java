package com.authentick.repository;

import com.authentick.model.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ReportRepository extends JpaRepository<Report, Long> {
    List<Report> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(r) FROM Report r WHERE r.product.batch.user.id = :userId")
    long countByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);
}
