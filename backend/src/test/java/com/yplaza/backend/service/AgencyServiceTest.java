package com.yplaza.backend.service;

import com.yplaza.backend.dto.AgencyRequest;
import com.yplaza.backend.entity.Agency;
import com.yplaza.backend.repository.AgencyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("AgencyService — Tests unitaires")
class AgencyServiceTest {

    @Mock AgencyRepository agencyRepository;
    @InjectMocks AgencyService agencyService;

    private Agency sampleAgency;

    @BeforeEach
    void setUp() {
        sampleAgency = Agency.builder()
                .id(1L)
                .name("Y-Plaza Paris")
                .city("Paris")
                .address("12 rue de la Paix")
                .build();
    }

    @Test
    @DisplayName("findAll() — retourne la liste de toutes les agences")
    void findAll_shouldReturnAllAgencies() {
        when(agencyRepository.findAll()).thenReturn(List.of(sampleAgency));

        var result = agencyService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Y-Plaza Paris");
        assertThat(result.get(0).getCity()).isEqualTo("Paris");
    }

    @Test
    @DisplayName("findById() — retourne une agence existante")
    void findById_shouldReturnAgency() {
        when(agencyRepository.findById(1L)).thenReturn(Optional.of(sampleAgency));

        var result = agencyService.findById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Y-Plaza Paris");
    }

    @Test
    @DisplayName("findById() — lève une exception si l'agence n'existe pas")
    void findById_shouldThrowIfNotFound() {
        when(agencyRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> agencyService.findById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Agency not found");
    }

    @Test
    @DisplayName("create() — crée et retourne une nouvelle agence")
    void create_shouldPersistAndReturnAgency() {
        AgencyRequest request = new AgencyRequest();
        request.setName("Y-Plaza Lyon");
        request.setCity("Lyon");
        request.setAddress("5 place Bellecour");

        Agency saved = Agency.builder().id(2L).name("Y-Plaza Lyon").city("Lyon").address("5 place Bellecour").build();
        when(agencyRepository.save(any(Agency.class))).thenReturn(saved);

        var result = agencyService.create(request);

        assertThat(result.getName()).isEqualTo("Y-Plaza Lyon");
        assertThat(result.getId()).isEqualTo(2L);
        verify(agencyRepository).save(any(Agency.class));
    }

    @Test
    @DisplayName("delete() — supprime une agence par son id")
    void delete_shouldCallRepository() {
        agencyService.delete(1L);
        verify(agencyRepository).deleteById(1L);
    }

    @Test
    @DisplayName("update() — modifie les champs d'une agence existante")
    void update_shouldModifyAndReturnAgency() {
        AgencyRequest request = new AgencyRequest();
        request.setName("Y-Plaza Paris Centre");
        request.setCity("Paris");
        request.setAddress("15 avenue de l'Opéra");

        when(agencyRepository.findById(1L)).thenReturn(Optional.of(sampleAgency));
        when(agencyRepository.save(any(Agency.class))).thenAnswer(i -> i.getArgument(0));

        var result = agencyService.update(1L, request);

        assertThat(result.getName()).isEqualTo("Y-Plaza Paris Centre");
        assertThat(result.getAddress()).isEqualTo("15 avenue de l'Opéra");
    }
}
