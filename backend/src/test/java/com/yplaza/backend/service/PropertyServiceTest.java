package com.yplaza.backend.service;

import com.yplaza.backend.dto.PropertyRequest;
import com.yplaza.backend.entity.Agency;
import com.yplaza.backend.entity.Property;
import com.yplaza.backend.repository.AgencyRepository;
import com.yplaza.backend.repository.PropertyRepository;
import com.yplaza.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@DisplayName("PropertyService — Tests unitaires")
class PropertyServiceTest {

    @Mock PropertyRepository propertyRepository;
    @Mock AgencyRepository agencyRepository;
    @Mock UserRepository userRepository;
    @InjectMocks PropertyService propertyService;

    private Property sampleProperty;
    private Agency sampleAgency;

    @BeforeEach
    void setUp() {
        sampleAgency = Agency.builder().id(1L).name("Y-Plaza Paris").city("Paris").address("12 rue de la Paix").build();
        sampleProperty = Property.builder()
                .id(1L)
                .title("Appartement lumineux")
                .description("Beau 3 pièces")
                .price(new BigDecimal("280000"))
                .surface(72.0)
                .city("Paris")
                .address("5 rue Nationale")
                .type(Property.PropertyType.APARTMENT)
                .status(Property.Status.AVAILABLE)
                .agency(sampleAgency)
                .build();

        // Mock du contexte de sécurité pour les tests de création
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("agent@example.com");
        SecurityContext ctx = mock(SecurityContext.class);
        when(ctx.getAuthentication()).thenReturn(auth);
        SecurityContextHolder.setContext(ctx);
    }

    @Test
    @DisplayName("findAll() — retourne tous les biens")
    void findAll_shouldReturnAllProperties() {
        when(propertyRepository.findAll()).thenReturn(List.of(sampleProperty));

        var result = propertyService.findAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getTitle()).isEqualTo("Appartement lumineux");
    }

    @Test
    @DisplayName("findAvailable() — retourne uniquement les biens disponibles")
    void findAvailable_shouldReturnOnlyAvailable() {
        when(propertyRepository.findByStatus(Property.Status.AVAILABLE)).thenReturn(List.of(sampleProperty));

        var result = propertyService.findAvailable();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getStatus()).isEqualTo(Property.Status.AVAILABLE);
    }

    @Test
    @DisplayName("findById() — retourne un bien existant")
    void findById_shouldReturnProperty() {
        when(propertyRepository.findById(1L)).thenReturn(Optional.of(sampleProperty));

        var result = propertyService.findById(1L);

        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getPrice()).isEqualByComparingTo(new BigDecimal("280000"));
    }

    @Test
    @DisplayName("findById() — lève une exception si le bien n'existe pas")
    void findById_shouldThrowIfNotFound() {
        when(propertyRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> propertyService.findById(99L))
                .isInstanceOf(RuntimeException.class)
                .hasMessageContaining("Property not found");
    }

    @Test
    @DisplayName("findByCity() — retourne les biens d'une ville")
    void findByCity_shouldFilterByCity() {
        when(propertyRepository.findByCity("Paris")).thenReturn(List.of(sampleProperty));

        var result = propertyService.findByCity("Paris");

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getCity()).isEqualTo("Paris");
    }

    @Test
    @DisplayName("create() — crée un bien et le persiste")
    void create_shouldPersistProperty() {
        PropertyRequest request = new PropertyRequest();
        request.setTitle("Maison avec jardin");
        request.setPrice(new BigDecimal("450000"));
        request.setSurface(120.0);
        request.setCity("Lyon");
        request.setAddress("3 allée des Roses");
        request.setType(Property.PropertyType.HOUSE);

        when(userRepository.findByEmail("agent@example.com")).thenReturn(Optional.empty());
        when(propertyRepository.save(any(Property.class))).thenAnswer(i -> {
            Property p = i.getArgument(0);
            p = Property.builder()
                    .id(2L).title(p.getTitle()).price(p.getPrice())
                    .surface(p.getSurface()).city(p.getCity()).address(p.getAddress())
                    .type(p.getType()).status(Property.Status.AVAILABLE).build();
            return p;
        });

        var result = propertyService.create(request);

        assertThat(result.getTitle()).isEqualTo("Maison avec jardin");
        assertThat(result.getStatus()).isEqualTo(Property.Status.AVAILABLE);
        verify(propertyRepository).save(any(Property.class));
    }

    @Test
    @DisplayName("delete() — supprime un bien par son id")
    void delete_shouldCallRepository() {
        propertyService.delete(1L);
        verify(propertyRepository).deleteById(1L);
    }
}
