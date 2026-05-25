package com.yplaza.backend.repository;

import com.yplaza.backend.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByCity(String city);
    List<Property> findByStatus(Property.Status status);
    List<Property> findByAgencyId(Long agencyId);
}