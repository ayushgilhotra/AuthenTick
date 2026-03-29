package com.authentick.repository;

import com.authentick.model.Batch;
import com.authentick.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BatchRepository extends JpaRepository<Batch, Long> {
    List<Batch> findByUser(User user);
    long countByUser(User user);
}
