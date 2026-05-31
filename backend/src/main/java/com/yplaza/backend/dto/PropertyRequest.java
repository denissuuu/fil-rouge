package com.yplaza.backend.dto;

import com.yplaza.backend.entity.Property;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class PropertyRequest {
    @NotBlank
    private String title;
    private String description;
    @NotNull @Positive
    private BigDecimal price;
    @NotNull @Positive
    private Double surface;
    @NotBlank
    private String city;
    @NotBlank
    private String address;
    @NotNull
    private Property.PropertyType type;
    private Property.Status status;
    private Long agencyId;
}
