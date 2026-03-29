package com.authentick.dto;

import lombok.Data;

@Data
public class ReportRequest {
    private String token;
    private String reason;
    private String details;
    private String reporterEmail;
}
