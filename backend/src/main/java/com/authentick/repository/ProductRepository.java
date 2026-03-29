package com.authentick.repository;

import com.authentick.model.Batch;
import com.authentick.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {
    Optional<Product> findByToken(String token);
    List<Product> findByBatch(Batch batch);
    long countByBatch(Batch batch);
    List<Product> findByBatchIn(List<Batch> batches);
    
    @org.springframework.data.jpa.repository.Query("SELECT COUNT(p) FROM Product p WHERE p.batch.user = :user AND p.scanCount > :minScans")
    long countByBatchUserAndScanCountGreaterThan(@org.springframework.data.repository.query.Param("user") com.authentick.model.User user, @org.springframework.data.repository.query.Param("minScans") int minScans);
}
