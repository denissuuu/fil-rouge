-- ============================================================
-- Y-Plaza — Schéma de base de données
-- PostgreSQL 16
-- ============================================================

-- Suppression dans l'ordre inverse des dépendances
DROP TABLE IF EXISTS properties CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS agencies CASCADE;

DROP TYPE IF EXISTS user_role;
DROP TYPE IF EXISTS property_type;
DROP TYPE IF EXISTS property_status;

-- ── Types ENUM ───────────────────────────────────────────────

CREATE TYPE user_role AS ENUM ('CLIENT', 'AGENT', 'ADMIN');
CREATE TYPE property_type AS ENUM ('APARTMENT', 'HOUSE', 'COMMERCIAL', 'LAND');
CREATE TYPE property_status AS ENUM ('AVAILABLE', 'PENDING', 'SOLD');

-- ── Table agencies ───────────────────────────────────────────

CREATE TABLE agencies (
    id         BIGSERIAL PRIMARY KEY,
    name       VARCHAR(100) NOT NULL,
    city       VARCHAR(100) NOT NULL,
    address    VARCHAR(255) NOT NULL
);

-- ── Table users ──────────────────────────────────────────────

CREATE TABLE users (
    id         BIGSERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name  VARCHAR(100) NOT NULL,
    email      VARCHAR(255) NOT NULL UNIQUE,
    password   VARCHAR(255) NOT NULL,
    role       VARCHAR(20)  NOT NULL DEFAULT 'CLIENT',
    agency_id  BIGINT REFERENCES agencies(id) ON DELETE SET NULL,
    created_at TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);

-- ── Table properties ─────────────────────────────────────────

CREATE TABLE properties (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255)   NOT NULL,
    description TEXT,
    price       NUMERIC(12, 2) NOT NULL,
    surface     DOUBLE PRECISION NOT NULL,
    city        VARCHAR(100)   NOT NULL,
    address     VARCHAR(255)   NOT NULL,
    type        VARCHAR(20),
    status      VARCHAR(20)    DEFAULT 'AVAILABLE',
    agent_id    BIGINT REFERENCES users(id)     ON DELETE SET NULL,
    agency_id   BIGINT REFERENCES agencies(id)  ON DELETE SET NULL,
    created_at  TIMESTAMP      NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_properties_city   ON properties(city);
CREATE INDEX idx_properties_status ON properties(status);
CREATE INDEX idx_properties_agency ON properties(agency_id);

-- ── Vues utiles ──────────────────────────────────────────────

CREATE OR REPLACE VIEW v_properties_available AS
    SELECT p.*, u.first_name || ' ' || u.last_name AS agent_name, a.name AS agency_name
    FROM properties p
    LEFT JOIN users    u ON p.agent_id  = u.id
    LEFT JOIN agencies a ON p.agency_id = a.id
    WHERE p.status = 'AVAILABLE';

CREATE OR REPLACE VIEW v_stats_by_city AS
    SELECT city,
           COUNT(*)                                    AS total_biens,
           COUNT(*) FILTER (WHERE status = 'AVAILABLE') AS disponibles,
           COUNT(*) FILTER (WHERE status = 'SOLD')      AS vendus,
           ROUND(AVG(price)::NUMERIC, 2)               AS prix_moyen,
           ROUND(AVG(surface)::NUMERIC, 2)              AS surface_moyenne
    FROM properties
    GROUP BY city
    ORDER BY total_biens DESC;

-- ── Requêtes d'analyse ───────────────────────────────────────

-- Prix moyen par type de bien
-- SELECT type, ROUND(AVG(price)::NUMERIC, 2) AS prix_moyen
-- FROM properties GROUP BY type ORDER BY prix_moyen DESC;

-- Top 10 des biens les plus chers disponibles
-- SELECT title, city, price, surface FROM properties
-- WHERE status = 'AVAILABLE' ORDER BY price DESC LIMIT 10;

-- Nombre de biens par agence
-- SELECT a.name, COUNT(p.id) AS nb_biens
-- FROM agencies a LEFT JOIN properties p ON p.agency_id = a.id
-- GROUP BY a.name ORDER BY nb_biens DESC;
