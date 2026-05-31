package com.yplaza.backend.repository;

import com.yplaza.backend.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    List<Property> findByCity(String city);
    List<Property> findByStatus(Property.Status status);
    List<Property> findByType(Property.PropertyType type);
    List<Property> findByAgencyId(Long agencyId);
    List<Property> findByAgentId(Long agentId);
    List<Property> findByPriceBetween(BigDecimal min, BigDecimal max);
    List<Property> findByCityAndStatus(String city, Property.Status status);

    @Query("SELECT p FROM Property p WHERE p.status = 'AVAILABLE' ORDER BY p.createdAt DESC")
    List<Property> findLatestAvailable();

    @Query("SELECT p.city, COUNT(p) FROM Property p GROUP BY p.city ORDER BY COUNT(p) DESC")
    List<Object[]> countByCity();

    @Query("SELECT p.city, AVG(p.price) FROM Property p WHERE p.status = 'AVAILABLE' GROUP BY p.city")
    List<Object[]> avgPriceByCity();
}
