package com.yplaza.backend.repository;

import com.yplaza.backend.entity.Agency;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AgencyRepository extends JpaRepository<Agency, Long> {
}