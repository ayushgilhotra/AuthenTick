package com.authentick.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VerifyResponse {
    private String status; // genuine, suspicious, expired, recalled, invalid
    private String medicineName;
    private String manufacturer;
    private String batchNumber;
    private String expiryDate;
    private String manufactureDate;
    private String category;
    private int scanCount;
    private String lastScanLocation;
    private List<Map<String, String>> scanTimeline;
    private String message;
}
