package com.yplaza.backend.service;

import com.yplaza.backend.dto.AgencyRequest;
import com.yplaza.backend.dto.AgencyResponse;
import com.yplaza.backend.entity.Agency;
import com.yplaza.backend.repository.AgencyRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AgencyService {

    private final AgencyRepository agencyRepository;

    public List<AgencyResponse> findAll() {
        return agencyRepository.findAll().stream().map(AgencyResponse::from).toList();
    }

    public AgencyResponse findById(Long id) {
        return AgencyResponse.from(
                agencyRepository.findById(id).orElseThrow(() -> new RuntimeException("Agency not found"))
        );
    }

    public AgencyResponse create(AgencyRequest request) {
        var agency = Agency.builder()
                .name(request.getName())
                .city(request.getCity())
                .address(request.getAddress())
                .build();
        return AgencyResponse.from(agencyRepository.save(agency));
    }

    public AgencyResponse update(Long id, AgencyRequest request) {
        var agency = agencyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Agency not found"));
        agency.setName(request.getName());
        agency.setCity(request.getCity());
        agency.setAddress(request.getAddress());
        return AgencyResponse.from(agencyRepository.save(agency));
    }

    public void delete(Long id) {
        agencyRepository.deleteById(id);
    }
}
