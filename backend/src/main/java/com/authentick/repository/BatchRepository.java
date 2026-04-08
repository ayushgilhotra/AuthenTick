package com.authentick.repository;

import com.authentick.model.Batch;
import com.authentick.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface BatchRepository extends JpaRepository<Batch, Long> {
    List<Batch> findByUser(User user);
    long countByUser(User user);

    @Query("SELECT b FROM Batch b WHERE b.expiryDate IS NOT NULL AND b.expiryDate <= :date AND b.status = 'ACTIVE'")
    List<Batch> findBatchesExpiringSoon(@Param("date") LocalDate date);

    @Query("SELECT b FROM Batch b WHERE b.expiryDate IS NOT NULL AND b.expiryDate < :date AND b.status != 'EXPIRED' AND b.status != 'RECALLED'")
    List<Batch> findExpiredBatches(@Param("date") LocalDate date);

    List<Batch> findByUserOrderByCreatedAtDesc(User user);
}
