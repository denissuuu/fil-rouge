# Y-Plaza — Plateforme Immobilière

![CI](https://github.com/odenis/y-plaza/actions/workflows/ci.yml/badge.svg)
![Java](https://img.shields.io/badge/Java-17-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.5-green?logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Python](https://img.shields.io/badge/Python-3.11-yellow?logo=python)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue?logo=postgresql)

Plateforme web centralisée de gestion immobilière pour le groupe Y-Plaza — siège à Aix-en-Provence, réseau de 12 agences.

## Stack technique

| Couche | Technologie |
|--------|-------------|
| Backend API | Java 17 · Spring Boot 3.5 · Spring Security · JWT |
| Base de données | PostgreSQL 16 (Docker) · Spring Data JPA |
| Frontend | React 18 · TypeScript · Vite · Tailwind CSS |
| Analyse de données | Python 3.11 · Pandas · Scikit-learn · Flask |
| CI/CD | GitHub Actions |

## Architecture

```
y-plaza/
├── backend/        → API REST Spring Boot (:8080)
├── frontend/       → SPA React/Vite (:5173)
├── data/           → Analyse Python + API Flask (:5001)
├── database/       → schema.sql
└── .github/        → CI GitHub Actions
```

## Démarrage rapide

### Prérequis
- Docker Desktop
- Java 17+
- Node.js 20+
- Python 3.11+ *(optionnel)*

### Lancer le projet

```bash
# 1. Base de données
docker-compose up -d

# 2. Backend (nouveau terminal)
cd backend && ./mvnw spring-boot:run

# 3. Frontend (nouveau terminal)
cd frontend && npm install && npm run dev

# 4. Analyse Python (optionnel)
cd data && pip install -r requirements.txt && python api.py
```

L'application est disponible sur **http://localhost:5173**

### Comptes de démo

| Email | Mot de passe | Rôle |
|-------|-------------|------|
| admin@y-plaza.fr | admin1234 | Admin |
| s.martin@y-plaza.fr | agent1234 | Agent |

## Fonctionnalités

- Authentification JWT (inscription / connexion)
- Recherche et filtrage des biens (ville, type, prix, surface)
- Tri des annonces (date, prix, surface)
- Pagination des résultats
- Gestion des biens par les agents (CRUD + statut)
- Gestion des agences par l'admin
- Tableau de bord personnalisé par rôle
- Analyse statistique du marché immobilier (Python)
- Prédiction de prix par régression linéaire

## Tests

```bash
cd backend && ./mvnw test
```

## Licence
Projet scolaire — tous droits réservés.
