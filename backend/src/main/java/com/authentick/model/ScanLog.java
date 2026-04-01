package com.authentick.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "scan_logs")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ScanLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "scanned_at")
    private LocalDateTime scannedAt;

    @Column(name = "ip_address")
    private String ipAddress;

    private String city;
    private String country;

    @Column(name = "user_agent", length = 512)
    private String userAgent;

    @Column(name = "device_type")
    private String deviceType;

    @Column(name = "user_id")
    private Long userId;

    @PrePersist
    protected void onCreate() {
        scannedAt = LocalDateTime.now();
    }
}
