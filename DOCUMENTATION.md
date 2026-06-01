# Documentation Technique et Fonctionnelle — Y-Plaza

> Plateforme web de gestion immobilière — Groupe Y-Plaza (Aix-en-Provence)

---

## Table des matières

1. [Présentation du projet](#1-présentation-du-projet)
2. [Architecture globale](#2-architecture-globale)
3. [Base de données](#3-base-de-données)
4. [Backend Java — Spring Boot](#4-backend-java--spring-boot)
5. [Frontend React](#5-frontend-react)
6. [Module Python — Analyse de données](#6-module-python--analyse-de-données)
7. [Sécurité](#7-sécurité)
8. [Lancer le projet](#8-lancer-le-projet)
9. [Ce que le projet démontre (grille d'évaluation)](#9-ce-que-le-projet-démontre-grille-dévaluation)

---

## 1. Présentation du projet

### Contexte

Y-Plaza est un groupe immobilier implanté en France, avec son siège à Aix-en-Provence et un réseau de **12 agences** réparties sur le territoire national. L'entreprise est spécialisée dans la vente et l'achat de biens immobiliers résidentiels et professionnels.

### Objectif

Développer une **plateforme web centralisée** permettant :
- Aux **clients** de rechercher et consulter des biens à vendre
- Aux **agents immobiliers** de gérer les annonces de leur agence
- Aux **administrateurs** d'administrer l'ensemble de la plateforme
- D'**analyser les données** du marché immobilier pour guider les décisions stratégiques

### Périmètre fonctionnel

| Fonctionnalité | Rôle concerné |
|---|---|
| Consulter les annonces et les filtrer | Tous (public) |
| Créer un compte / se connecter | Tous |
| Publier et gérer des biens | Agent, Admin |
| Gérer les agences | Admin |
| Tableau de bord personnalisé | Tous (connectés) |
| Analyses statistiques du marché | Admin, usage interne |

---

## 2. Architecture globale

```
y-plaza/
├── backend/        → API REST Java Spring Boot (port 8080)
├── frontend/       → Application React TypeScript (port 5173)
├── data/           → Module d'analyse Python (port 5001)
└── docker-compose.yml  → Base de données PostgreSQL (port 5432)
```

### Schéma d'architecture

```
┌─────────────┐     HTTP/REST      ┌──────────────────┐
│   Frontend  │ ◄────────────────► │  Backend Spring  │
│  React/Vite │   Bearer JWT       │  Boot (Java 17)  │
│  :5173      │                    │  :8080           │
└─────────────┘                    └────────┬─────────┘
                                            │ JPA/Hibernate
                                   ┌────────▼─────────┐
                                   │   PostgreSQL 16   │
                                   │   Docker :5432    │
                                   └──────────────────┘

┌─────────────┐     HTTP/REST
│   Frontend  │ ◄────────────────► Module Python Flask :5001
│  (Analytics)│                    (analyse de données)
└─────────────┘
```

### Flux d'authentification (JWT)

```
Client → POST /api/auth/login → Serveur vérifie email+password BCrypt
       ← token JWT (valable 24h)
Client → GET /api/properties (Header: Authorization: Bearer <token>)
       → JwtAuthenticationFilter valide le token
       ← Données JSON
```

---

## 3. Base de données

### Modèle relationnel

```
┌──────────────┐       ┌──────────────┐       ┌──────────────┐
│   agencies   │       │    users     │       │  properties  │
├──────────────┤       ├──────────────┤       ├──────────────┤
│ id (PK)      │◄──┐   │ id (PK)      │◄──┐   │ id (PK)      │
│ name         │   │   │ first_name   │   │   │ title        │
│ city         │   │   │ last_name    │   │   │ description  │
│ address      │   │   │ email        │   │   │ price        │
└──────────────┘   │   │ password     │   │   │ surface      │
                   └───│ agency_id FK │   │   │ city         │
                       │ role         │   │   │ address      │
                       │ created_at   │   │   │ type (ENUM)  │
                       └──────────────┘   │   │ status(ENUM) │
                                          └───│ agent_id FK  │
                                              │ agency_id FK │
                                              │ created_at   │
                                              └──────────────┘
```

### Tables et colonnes

#### Table `agencies`
| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGINT | PK, AUTO | Identifiant unique |
| name | VARCHAR | NOT NULL | Nom de l'agence |
| city | VARCHAR | NOT NULL | Ville de l'agence |
| address | VARCHAR | NOT NULL | Adresse complète |

#### Table `users`
| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGINT | PK, AUTO | Identifiant unique |
| first_name | VARCHAR | NOT NULL | Prénom |
| last_name | VARCHAR | NOT NULL | Nom |
| email | VARCHAR | NOT NULL, UNIQUE | Adresse email (identifiant de connexion) |
| password | VARCHAR | NOT NULL | Mot de passe chiffré BCrypt |
| role | ENUM | NOT NULL | CLIENT / AGENT / ADMIN |
| agency_id | BIGINT | FK → agencies | Agence rattachée (agents uniquement) |
| created_at | TIMESTAMP | NOT NULL | Date de création (automatique) |

#### Table `properties`
| Colonne | Type | Contrainte | Description |
|---|---|---|---|
| id | BIGINT | PK, AUTO | Identifiant unique |
| title | VARCHAR | NOT NULL | Titre de l'annonce |
| description | TEXT | | Description du bien |
| price | DECIMAL | NOT NULL | Prix en euros |
| surface | DOUBLE | NOT NULL | Surface en m² |
| city | VARCHAR | NOT NULL | Ville |
| address | VARCHAR | NOT NULL | Adresse complète |
| type | ENUM | | APARTMENT / HOUSE / COMMERCIAL / LAND |
| status | ENUM | DEFAULT AVAILABLE | AVAILABLE / PENDING / SOLD |
| agent_id | BIGINT | FK → users | Agent responsable |
| agency_id | BIGINT | FK → agencies | Agence propriétaire de l'annonce |
| created_at | TIMESTAMP | NOT NULL | Date de publication (automatique) |

### Requêtes SQL notables (Spring Data JPA)

```sql
-- Biens disponibles dans une ville
SELECT * FROM properties WHERE city = :city AND status = 'AVAILABLE';

-- Prix moyen par ville (pour l'analyse)
SELECT city, AVG(price) FROM properties
WHERE status = 'AVAILABLE' GROUP BY city;

-- Nombre de biens par ville
SELECT city, COUNT(*) FROM properties GROUP BY city ORDER BY COUNT(*) DESC;

-- Biens d'une agence
SELECT * FROM properties WHERE agency_id = :agencyId;

-- Dernières annonces disponibles
SELECT * FROM properties WHERE status = 'AVAILABLE' ORDER BY created_at DESC;
```

---

## 4. Backend Java — Spring Boot

### Stack technique

| Technologie | Version | Rôle |
|---|---|---|
| Java | 17 | Langage |
| Spring Boot | 3.5 | Framework web |
| Spring Security | 6 | Authentification / Autorisation |
| Spring Data JPA | 3.5 | ORM / accès base de données |
| Hibernate | 6 | Implémentation JPA |
| PostgreSQL Driver | | Connexion BDD |
| JWT (jjwt) | 0.11.5 | Tokens d'authentification |
| Lombok | | Réduction du code boilerplate |
| Bean Validation | | Validation des entrées |

### Structure des packages

```
com.yplaza.backend/
├── entity/         → Entités JPA (User, Property, Agency)
├── repository/     → Interfaces Spring Data (requêtes SQL)
├── service/        → Logique métier (AuthService, PropertyService, AgencyService)
├── controller/     → Endpoints REST (AuthController, PropertyController, AgencyController)
├── dto/            → Objets de transfert (Request/Response)
├── config/         → Sécurité, JWT, CORS, ApplicationConfig
└── exception/      → Gestionnaire global d'erreurs
```

### Principes appliqués

- **SOLID** : chaque classe a une responsabilité unique (service ≠ controller ≠ repository)
- **DRY** : mapping DTO centralisé dans `PropertyResponse.from()` et `AgencyResponse.from()`
- **POO** : héritage (`UserDetails`), encapsulation (Lombok), enums (Role, Status, PropertyType)
- **Couche de service** : les controllers ne contiennent aucune logique métier

### Endpoints API REST

#### Authentification (`/api/auth`) — Public

| Méthode | Route | Description | Body |
|---|---|---|---|
| POST | `/api/auth/register` | Créer un compte | `{firstName, lastName, email, password}` |
| POST | `/api/auth/login` | Se connecter | `{email, password}` |

Réponse :
```json
{
  "token": "eyJhbGci...",
  "id": 1,
  "firstName": "Jean",
  "lastName": "Dupont",
  "email": "jean@example.com",
  "role": "CLIENT"
}
```

#### Biens immobiliers (`/api/properties`)

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/properties` | Public | Liste des biens disponibles |
| GET | `/api/properties/all` | Agent, Admin | Tous les biens (tous statuts) |
| GET | `/api/properties/{id}` | Public | Détail d'un bien |
| GET | `/api/properties/city/{city}` | Public | Biens par ville |
| GET | `/api/properties/agency/{id}` | Public | Biens d'une agence |
| POST | `/api/properties` | Agent, Admin | Créer une annonce |
| PUT | `/api/properties/{id}` | Agent, Admin | Modifier une annonce |
| DELETE | `/api/properties/{id}` | Admin | Supprimer une annonce |

#### Agences (`/api/agencies`)

| Méthode | Route | Accès | Description |
|---|---|---|---|
| GET | `/api/agencies` | Public | Liste de toutes les agences |
| GET | `/api/agencies/{id}` | Public | Détail d'une agence |
| POST | `/api/agencies` | Admin | Créer une agence |
| PUT | `/api/agencies/{id}` | Admin | Modifier une agence |
| DELETE | `/api/agencies/{id}` | Admin | Supprimer une agence |

### Configuration (application.yml)

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/yplaza
    username: admin
    password: admin
  jpa:
    hibernate:
      ddl-auto: update   # Crée/met à jour le schéma automatiquement
    show-sql: true

server:
  port: 8080

application:
  security:
    jwt:
      expiration: 86400000  # 24 heures
```

---

## 5. Frontend React

### Stack technique

| Technologie | Version | Rôle |
|---|---|---|
| React | 18 | Framework UI |
| TypeScript | 5 | Typage statique |
| Vite | 5 | Bundler / serveur de dev |
| React Router | 6 | Navigation SPA |
| Tailwind CSS | 3 | CSS utilitaire (responsive) |
| Axios | 1.7 | Requêtes HTTP vers l'API |
| Lucide React | | Icônes |

### Structure

```
frontend/src/
├── api/
│   ├── client.ts       → Instance Axios + intercepteur JWT
│   ├── auth.ts         → login(), register()
│   ├── properties.ts   → CRUD biens + filterProperties()
│   └── agencies.ts     → Lecture agences
├── components/
│   ├── Navbar.tsx      → Barre de navigation responsive
│   ├── PropertyCard.tsx→ Carte d'annonce (liste)
│   └── Footer.tsx      → Pied de page
├── contexts/
│   └── AuthContext.tsx → Gestion état authentification (localStorage)
├── pages/
│   ├── Home.tsx        → Accueil : hero, stats, dernières annonces
│   ├── Properties.tsx  → Liste avec filtres (ville, type, prix, surface)
│   ├── PropertyDetail.tsx → Fiche complète d'un bien
│   ├── Login.tsx       → Formulaire de connexion
│   ├── Register.tsx    → Formulaire d'inscription
│   ├── Agencies.tsx    → Liste des agences
│   └── Dashboard.tsx   → Espace personnel (adapté au rôle)
└── types/
    └── index.ts        → Types TypeScript partagés
```

### Pages et fonctionnalités

#### Page d'accueil (`/`)
- Section hero avec champ de recherche par ville
- Statistiques (12 agences, 500+ biens, 98% clients satisfaits)
- 6 dernières annonces disponibles
- Call-to-action vers les agences et l'inscription

#### Page annonces (`/properties`)
- Affichage de tous les biens disponibles
- Panneau de filtres : ville, type, prix maximum, surface minimum
- Filtrage en temps réel côté client
- Compteur de résultats

#### Fiche bien (`/properties/:id`)
- Toutes les informations du bien
- Badge statut coloré (vert/orange/rouge)
- Coordonnées de l'agent et de l'agence
- Boutons "Prendre contact" et "Planifier une visite"

#### Tableau de bord (`/dashboard`) — Protégé
- Vue **CLIENT** : accès rapide aux annonces
- Vue **AGENT/ADMIN** : tableau de tous les biens + bouton "Nouvelle annonce"

#### Gestion de l'authentification
- Token JWT stocké dans `localStorage`
- Intercepteur Axios : injecte automatiquement `Authorization: Bearer <token>`
- Context React : `user`, `login()`, `logout()`, `isAuthenticated`
- Redirection automatique si non connecté

### Design et accessibilité

- **Responsive** : grilles CSS adaptatives (1 → 2 → 3 colonnes selon l'écran)
- **Couleurs** : palette cohérente `primary` (bleu #3b5bdb)
- **Contrastes** : textes gris foncé sur fond clair
- **Navigation** : sticky navbar, liens clairs
- **ARIA** : composants HTML sémantiques (`<nav>`, `<main>`, `<footer>`, labels de formulaires)

---

## 6. Module Python — Analyse de données

### Stack technique

| Bibliothèque | Rôle |
|---|---|
| Pandas | Manipulation et analyse des données |
| SQLAlchemy | Connexion PostgreSQL |
| Matplotlib / Seaborn | Génération de graphiques |
| Scikit-learn | Modèle de prédiction de prix |
| Flask | API REST d'exposition des résultats |
| Flask-CORS | Autoriser les appels depuis le frontend |

### Fonctions d'analyse (`analysis.py`)

#### 1. Rapport de ventes — `rapport_ventes(df)`
Calcule :
- Nombre total de biens, vendus, disponibles, sous offre
- Taux de vente (%)
- Prix moyen et médian
- Surface moyenne

#### 2. Biens populaires par ville — `biens_populaires_par_ville(df)`
Retourne un DataFrame groupé par ville avec :
- Nombre de biens
- Prix moyen
- Surface moyenne

Identifie les **zones géographiques les plus actives** du marché.

#### 3. Prédiction de prix — `predire_prix(df)`
Modèle de **régression linéaire** (scikit-learn) :
- Variables d'entrée : surface (m²), type de bien, ville
- Variable cible : prix (€)
- Métriques : MAE (erreur absolue moyenne) et R² (qualité du modèle)
- Encodage des variables catégorielles avec `LabelEncoder`

#### 4. Graphiques automatiques
| Fichier généré | Description |
|---|---|
| `output/prix_par_ville.png` | Histogramme des prix moyens par ville (Top 10) |
| `output/repartition_types.png` | Camembert de la répartition des types de biens |
| `output/prix_vs_surface.png` | Nuage de points prix / surface |

### API Flask (`api.py`)

| Route | Description |
|---|---|
| `GET /api/analytics` | Rapport complet (ventes + villes + métriques modèle) |
| `GET /api/analytics/cities` | Classement des villes |
| `GET /api/analytics/summary` | Chiffres clés uniquement |

- Utilise les données réelles de PostgreSQL si disponibles
- Bascule automatiquement sur des **données de démo** si la BDD est vide ou inaccessible

---

## 7. Sécurité

### Authentification JWT

1. L'utilisateur envoie email + password au endpoint `/api/auth/login`
2. Le serveur vérifie le mot de passe avec **BCrypt** (hachage à sens unique)
3. Si valide, le serveur génère un **token JWT** signé avec une clé secrète HS256
4. Le client stocke ce token et l'envoie dans chaque requête (`Authorization: Bearer ...`)
5. Le filtre `JwtAuthenticationFilter` valide le token à chaque requête

### Autorisation par rôle (`@PreAuthorize`)

```java
// Visible par tous
@GetMapping("/api/properties")

// Réservé aux agents et admins
@PreAuthorize("hasAnyRole('AGENT', 'ADMIN')")
@PostMapping("/api/properties")

// Réservé aux admins
@PreAuthorize("hasRole('ADMIN')")
@DeleteMapping("/api/properties/{id}")
```

### Protections en place

| Menace | Protection |
|---|---|
| Mots de passe en clair | BCrypt (coût par défaut = 10) |
| Falsification de token | Signature HMAC-SHA256 |
| Accès non autorisé | Vérification rôle par endpoint |
| Attaque CSRF | Désactivé (API stateless + JWT) |
| Appels cross-origin non autorisés | CORS restreint à `localhost:5173` |
| Données invalides | Validation Bean (`@Valid`, `@NotBlank`, `@Email`, `@Positive`) |
| Erreurs exposées | `GlobalExceptionHandler` retourne des messages génériques |

---

## 8. Lancer le projet

### Prérequis

- **Docker Desktop** (pour PostgreSQL)
- **Java 17+** (ou JDK inclus dans IntelliJ)
- **Node.js 20+** — à télécharger sur [nodejs.org](https://nodejs.org)
- **Python 3.11+** (optionnel, pour le module data)

### Étapes

#### 1. Base de données
```bash
# Depuis la racine du projet
docker-compose up -d
# PostgreSQL accessible sur localhost:5432
```

#### 2. Backend Spring Boot
```bash
cd backend
./mvnw spring-boot:run
# API disponible sur http://localhost:8080
```

#### 3. Frontend React
```bash
cd frontend
npm install        # première fois uniquement
npm run dev
# Application sur http://localhost:5173
```

#### 4. Module Python (optionnel)
```bash
cd data
pip install -r requirements.txt
python analysis.py  # rapport en console + graphiques dans data/output/
python api.py       # API analytique sur http://localhost:5001
```

### Premier lancement — créer les données

1. Créer un compte administrateur via `POST /api/auth/register`
   - Modifier manuellement le `role` en `ADMIN` dans la BDD
2. Créer des agences via `POST /api/agencies`
3. Créer des biens via `POST /api/properties`

---

## 9. Ce que le projet démontre (grille d'évaluation)

### Concevoir une solution logicielle répondant à un besoin métier
Le projet répond au brief de Y-Plaza : plateforme centralisée de gestion immobilière pour un groupe avec siège et 12 agences. Les choix techniques (API REST + SPA) sont justifiés par le besoin d'accessibilité multi-agences.

### Développer une application fonctionnelle (Python, Java, JavaScript)
Trois langages utilisés :
- **Java** (Spring Boot) — backend complet avec authentification et CRUD
- **TypeScript/JavaScript** (React) — interface utilisateur complète
- **Python** — analyse statistique et prédiction de prix

### Appliquer les bonnes pratiques (SOLID, DRY, KISS)
- **Single Responsibility** : Controller, Service, Repository, Entity — chaque couche a un rôle précis
- **DRY** : les mappings DTO → entité sont centralisés (`PropertyResponse.from()`)
- **KISS** : pas de surarchitecture, code lisible et direct

### Appliquer les principes de la POO
- **Encapsulation** : entités avec getters/setters via Lombok `@Data`
- **Implémentation d'interface** : `User implements UserDetails` (Spring Security)
- **Enums** : `User.Role`, `Property.Status`, `Property.PropertyType`
- **Builder pattern** : construction des entités avec `@Builder`

### Modéliser une base de données relationnelle
Schéma avec 3 tables, 2 clés étrangères, contraintes NOT NULL et UNIQUE, enums PostgreSQL.

### Écrire des requêtes SQL
Requêtes Spring Data JPA : `findByCity`, `findByStatus`, `findByAgencyId`, `avgPriceByCity`, `countByCity`, plus requêtes JPQL personnalisées pour les analyses.

### Concevoir des interfaces web intuitives
Interface épurée avec hiérarchie visuelle claire, badges colorés par statut, cartes de propriétés, navigation fixe, feedback utilisateur (messages d'erreur, états de chargement).

### Interfaces web responsives et accessibles
Grilles Tailwind adaptatives (mobile → tablette → desktop), balises HTML sémantiques, labels sur tous les champs de formulaire, contrastes conformes WCAG AA.
