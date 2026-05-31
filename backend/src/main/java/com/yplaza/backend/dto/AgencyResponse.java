package com.yplaza.backend.dto;

import com.yplaza.backend.entity.Agency;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AgencyResponse {
    private Long id;
    private String name;
    private String city;
    private String address;
    private int agentCount;

    public static AgencyResponse from(Agency a) {
        return AgencyResponse.builder()
                .id(a.getId())
                .name(a.getName())
                .city(a.getCity())
                .address(a.getAddress())
                .agentCount(a.getAgents() != null ? a.getAgents().size() : 0)
                .build();
    }
}
