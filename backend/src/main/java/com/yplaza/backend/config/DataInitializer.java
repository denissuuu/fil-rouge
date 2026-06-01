package com.yplaza.backend.config;

import com.yplaza.backend.entity.Agency;
import com.yplaza.backend.entity.Property;
import com.yplaza.backend.entity.User;
import com.yplaza.backend.repository.AgencyRepository;
import com.yplaza.backend.repository.PropertyRepository;
import com.yplaza.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@Profile("!test")
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final AgencyRepository agencyRepository;
    private final UserRepository userRepository;
    private final PropertyRepository propertyRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (agencyRepository.count() > 0) {
            log.info("Données de démo déjà présentes — initialisation ignorée.");
            return;
        }

        log.info("Initialisation des données de démo Y-Plaza...");

        // ── Agences ──────────────────────────────────────────
        var agencies = agencyRepository.saveAll(List.of(
            Agency.builder().name("Y-Plaza Paris Centre").city("Paris").address("12 avenue des Champs-Élysées").build(),
            Agency.builder().name("Y-Plaza Lyon Presqu'île").city("Lyon").address("5 place Bellecour").build(),
            Agency.builder().name("Y-Plaza Marseille Vieux-Port").city("Marseille").address("3 quai du Port").build(),
            Agency.builder().name("Y-Plaza Nice Côte d'Azur").city("Nice").address("8 promenade des Anglais").build(),
            Agency.builder().name("Y-Plaza Bordeaux Chartrons").city("Bordeaux").address("18 cours du Chapeau Rouge").build(),
            Agency.builder().name("Y-Plaza Toulouse Capitole").city("Toulouse").address("2 place du Capitole").build()
        ));

        // ── Utilisateurs ─────────────────────────────────────
        var admin = User.builder()
                .firstName("Admin").lastName("Y-Plaza")
                .email("admin@y-plaza.fr")
                .password(passwordEncoder.encode("admin1234"))
                .role(User.Role.ADMIN).agency(agencies.get(0)).build();

        var agent1 = User.builder()
                .firstName("Sophie").lastName("Martin")
                .email("s.martin@y-plaza.fr")
                .password(passwordEncoder.encode("agent1234"))
                .role(User.Role.AGENT).agency(agencies.get(0)).build();

        var agent2 = User.builder()
                .firstName("Lucas").lastName("Bernard")
                .email("l.bernard@y-plaza.fr")
                .password(passwordEncoder.encode("agent1234"))
                .role(User.Role.AGENT).agency(agencies.get(1)).build();

        userRepository.saveAll(List.of(admin, agent1, agent2));

        // ── Biens ────────────────────────────────────────────
        propertyRepository.saveAll(List.of(
            prop("Appartement Haussmannien lumineux", "Magnifique 4 pièces de 95m² avec parquet et moulures d'époque.", 650000, 95, "Paris", "24 boulevard Haussmann", Property.PropertyType.APARTMENT, Property.Status.AVAILABLE, agent1, agencies.get(0)),
            prop("Studio moderne Paris 11e", "Studio entièrement rénové, idéal investissement locatif.", 185000, 28, "Paris", "8 rue de la Roquette", Property.PropertyType.APARTMENT, Property.Status.AVAILABLE, agent1, agencies.get(0)),
            prop("Maison avec jardin Montmartre", "Belle maison de ville sur 3 niveaux, jardin privatif de 80m².", 1200000, 160, "Paris", "3 rue Lepic", Property.PropertyType.HOUSE, Property.Status.PENDING, agent1, agencies.get(0)),
            prop("Appartement vue Saône", "3 pièces avec terrasse et vue panoramique sur la Saône.", 320000, 68, "Lyon", "15 quai Saint-Antoine", Property.PropertyType.APARTMENT, Property.Status.AVAILABLE, agent2, agencies.get(1)),
            prop("Maison en pierres dorées", "Authentique maison beaujolaise rénovée, 4 chambres.", 480000, 145, "Lyon", "12 route des Vignes", Property.PropertyType.HOUSE, Property.Status.AVAILABLE, agent2, agencies.get(1)),
            prop("Local commercial Presqu'île", "Rez-de-chaussée commercial de 85m², fort passage piéton.", 390000, 85, "Lyon", "7 rue de la République", Property.PropertyType.COMMERCIAL, Property.Status.AVAILABLE, agent2, agencies.get(1)),
            prop("Villa avec piscine Marseille", "Villa contemporaine 5 pièces, piscine, vue mer exceptionnelle.", 890000, 200, "Marseille", "42 corniche Kennedy", Property.PropertyType.HOUSE, Property.Status.AVAILABLE, null, agencies.get(2)),
            prop("Appartement Vieux-Port", "T3 entièrement refait, vue directe sur le Vieux-Port.", 295000, 62, "Marseille", "5 place aux Huiles", Property.PropertyType.APARTMENT, Property.Status.SOLD, null, agencies.get(2)),
            prop("Studio étudiant Promenade", "Studio meublé à 50m de la mer, idéal location saisonnière.", 145000, 22, "Nice", "16 promenade des Anglais", Property.PropertyType.APARTMENT, Property.Status.AVAILABLE, null, agencies.get(3)),
            prop("Villa Belle Époque Nice", "Villa authentique 6 pièces avec parc arboré de 2000m².", 1850000, 280, "Nice", "8 avenue des Fleurs", Property.PropertyType.HOUSE, Property.Status.AVAILABLE, null, agencies.get(3)),
            prop("Terrain constructible Bordeaux", "Terrain viabilisé de 600m², permis de construire purgé.", 195000, 600, "Bordeaux", "Rue des Chartrons", Property.PropertyType.LAND, Property.Status.AVAILABLE, null, agencies.get(4)),
            prop("Loft Bordeaux Chartrons", "Loft industriel 4 pièces dans ancien chai bordelais.", 420000, 110, "Bordeaux", "24 quai des Chartrons", Property.PropertyType.APARTMENT, Property.Status.AVAILABLE, null, agencies.get(4)),
            prop("Maison toulousaine", "Maison traditionnelle en brique rose, 4 chambres, garage.", 380000, 130, "Toulouse", "18 rue des Lois", Property.PropertyType.HOUSE, Property.Status.AVAILABLE, null, agencies.get(5)),
            prop("Appartement Capitole", "T2 lumineux à 2 minutes de la place du Capitole.", 210000, 45, "Toulouse", "6 rue Saint-Rome", Property.PropertyType.APARTMENT, Property.Status.PENDING, null, agencies.get(5))
        ));

        log.info("Données de démo créées : {} agences, 3 utilisateurs, 14 biens.", agencies.size());
        log.info("Compte admin : admin@y-plaza.fr / admin1234");
        log.info("Compte agent : s.martin@y-plaza.fr / agent1234");
    }

    private Property prop(String title, String desc, int price, double surface,
                          String city, String address, Property.PropertyType type,
                          Property.Status status, User agent, Agency agency) {
        return Property.builder()
                .title(title).description(desc)
                .price(new BigDecimal(price)).surface(surface)
                .city(city).address(address)
                .type(type).status(status)
                .agent(agent).agency(agency)
                .build();
    }
}
