package com.authentick.dto;

import lombok.Data;

@Data
public class BatchRequest {
    private Long medicineId;
    private String batchNumber;
    private String manufactureDate;
    private String expiryDate;
    private Integer quantity;
}
