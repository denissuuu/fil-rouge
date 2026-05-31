package com.yplaza.backend.dto;

import com.yplaza.backend.entity.Property;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class PropertyResponse {
    private Long id;
    private String title;
    private String description;
    private BigDecimal price;
    private Double surface;
    private String city;
    private String address;
    private Property.PropertyType type;
    private Property.Status status;
    private String agentName;
    private String agencyName;
    private Long agencyId;
    private LocalDateTime createdAt;

    public static PropertyResponse from(Property p) {
        return PropertyResponse.builder()
                .id(p.getId())
                .title(p.getTitle())
                .description(p.getDescription())
                .price(p.getPrice())
                .surface(p.getSurface())
                .city(p.getCity())
                .address(p.getAddress())
                .type(p.getType())
                .status(p.getStatus())
                .agentName(p.getAgent() != null ? p.getAgent().getFirstName() + " " + p.getAgent().getLastName() : null)
                .agencyName(p.getAgency() != null ? p.getAgency().getName() : null)
                .agencyId(p.getAgency() != null ? p.getAgency().getId() : null)
                .createdAt(p.getCreatedAt())
                .build();
    }
}
