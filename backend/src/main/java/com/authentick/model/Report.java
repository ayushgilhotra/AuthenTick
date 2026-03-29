package com.authentick.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private String reason;

    @Column(length = 2000)
    private String details;

    @Column(name = "reporter_email")
    private String reporterEmail;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ReportStatus status = ReportStatus.PENDING;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }

    public enum ReportStatus {
        PENDING, REVIEWED, RESOLVED
    }
}
