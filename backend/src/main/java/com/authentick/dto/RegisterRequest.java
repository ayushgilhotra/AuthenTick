package com.authentick.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String name;
    private String email;
    private String password;
    private String role; // ADMIN, RETAILER, or CUSTOMER
    private String phone; // optional, for CUSTOMER
}
