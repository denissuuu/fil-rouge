package com.yplaza.backend.controller;

import com.yplaza.backend.dto.AgencyRequest;
import com.yplaza.backend.dto.AgencyResponse;
import com.yplaza.backend.service.AgencyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/agencies")
@RequiredArgsConstructor
public class AgencyController {

    private final AgencyService agencyService;

    @GetMapping
    public ResponseEntity<List<AgencyResponse>> getAll() {
        return ResponseEntity.ok(agencyService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<AgencyResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(agencyService.findById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AgencyResponse> create(@Valid @RequestBody AgencyRequest request) {
        return ResponseEntity.ok(agencyService.create(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<AgencyResponse> update(@PathVariable Long id, @Valid @RequestBody AgencyRequest request) {
        return ResponseEntity.ok(agencyService.update(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        agencyService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
