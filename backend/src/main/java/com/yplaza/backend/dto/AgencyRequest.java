package com.yplaza.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AgencyRequest {
    @NotBlank
    private String name;
    @NotBlank
    private String city;
    @NotBlank
    private String address;
}
