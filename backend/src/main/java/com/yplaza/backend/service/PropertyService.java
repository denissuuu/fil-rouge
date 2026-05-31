package com.yplaza.backend.service;

import com.yplaza.backend.dto.PropertyRequest;
import com.yplaza.backend.dto.PropertyResponse;
import com.yplaza.backend.entity.Property;
import com.yplaza.backend.repository.AgencyRepository;
import com.yplaza.backend.repository.PropertyRepository;
import com.yplaza.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PropertyService {

    private final PropertyRepository propertyRepository;
    private final AgencyRepository agencyRepository;
    private final UserRepository userRepository;

    public List<PropertyResponse> findAll() {
        return propertyRepository.findAll().stream().map(PropertyResponse::from).toList();
    }

    public List<PropertyResponse> findAvailable() {
        return propertyRepository.findByStatus(Property.Status.AVAILABLE)
                .stream().map(PropertyResponse::from).toList();
    }

    public List<PropertyResponse> findByCity(String city) {
        return propertyRepository.findByCity(city).stream().map(PropertyResponse::from).toList();
    }

    public List<PropertyResponse> findByAgency(Long agencyId) {
        return propertyRepository.findByAgencyId(agencyId).stream().map(PropertyResponse::from).toList();
    }

    public PropertyResponse findById(Long id) {
        return PropertyResponse.from(
                propertyRepository.findById(id).orElseThrow(() -> new RuntimeException("Property not found"))
        );
    }

    public PropertyResponse create(PropertyRequest request) {
        var property = Property.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .price(request.getPrice())
                .surface(request.getSurface())
                .city(request.getCity())
                .address(request.getAddress())
                .type(request.getType())
                .status(request.getStatus() != null ? request.getStatus() : Property.Status.AVAILABLE)
                .build();

        if (request.getAgencyId() != null) {
            property.setAgency(agencyRepository.findById(request.getAgencyId())
                    .orElseThrow(() -> new RuntimeException("Agency not found")));
        }

        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        userRepository.findByEmail(email).ifPresent(property::setAgent);

        return PropertyResponse.from(propertyRepository.save(property));
    }

    public PropertyResponse update(Long id, PropertyRequest request) {
        var property = propertyRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setPrice(request.getPrice());
        property.setSurface(request.getSurface());
        property.setCity(request.getCity());
        property.setAddress(request.getAddress());
        property.setType(request.getType());
        if (request.getStatus() != null) property.setStatus(request.getStatus());
        if (request.getAgencyId() != null) {
            property.setAgency(agencyRepository.findById(request.getAgencyId())
                    .orElseThrow(() -> new RuntimeException("Agency not found")));
        }

        return PropertyResponse.from(propertyRepository.save(property));
    }

    public void delete(Long id) {
        propertyRepository.deleteById(id);
    }
}
