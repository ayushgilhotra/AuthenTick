package com.authentick.repository;

import com.authentick.model.Product;
import com.authentick.model.ScanLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.util.List;

public interface ScanLogRepository extends JpaRepository<ScanLog, Long> {
    List<ScanLog> findByProductOrderByScannedAtDesc(Product product);

    @Query("SELECT s FROM ScanLog s ORDER BY s.scannedAt DESC")
    List<ScanLog> findRecentScans();

    @Query("SELECT COUNT(s) FROM ScanLog s WHERE s.product.batch.user.id = :userId")
    long countByUserId(@org.springframework.data.repository.query.Param("userId") Long userId);

    @Query("SELECT SUBSTRING(str(s.scannedAt), 1, 10) as scanDate, COUNT(s) FROM ScanLog s WHERE s.product.batch.user.id = :userId GROUP BY SUBSTRING(str(s.scannedAt), 1, 10) ORDER BY scanDate DESC")
    List<Object[]> getScanActivityByUser(@org.springframework.data.repository.query.Param("userId") Long userId);
}
