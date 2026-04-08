package com.authentick.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "batches")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Batch {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "medicine_id", nullable = false)
    private Medicine medicine;

    @Column(name = "batch_number", nullable = false)
    private String batchNumber;

    @Column(name = "manufacture_date")
    private LocalDate manufactureDate;

    @Column(name = "expiry_date")
    private LocalDate expiryDate;

    @Column(nullable = false)
    private Integer quantity;

    @Column(name = "is_recalled")
    private Boolean isRecalled = false;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private BatchStatus status = BatchStatus.ACTIVE;

    @Column(name = "integrity_score")
    @Builder.Default
    private Integer integrityScore = 100;

    @Column(name = "expiry_notified")
    @Builder.Default
    private Boolean expiryNotified = false;

    @Column(name = "expired_notified")
    @Builder.Default
    private Boolean expiredNotified = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum BatchStatus {
        ACTIVE,
        EXPIRING_SOON,
        EXPIRED,
        RECALLED
    }
}
