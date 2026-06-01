"""
Analyse statistique du marché immobilier Y-Plaza.
Produit des rapports de ventes, prédictions de prix et identification des zones populaires.
"""

import pandas as pd
import numpy as np
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.preprocessing import LabelEncoder
import os

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

sns.set_theme(style="whitegrid", palette="Blues_d")


# ── Rapport de ventes ────────────────────────────────────────────────────────

def rapport_ventes(df: pd.DataFrame) -> dict:
    """Statistiques globales sur les biens."""
    total = len(df)
    vendus = len(df[df["status"] == "SOLD"])
    disponibles = len(df[df["status"] == "AVAILABLE"])
    sous_offre = len(df[df["status"] == "PENDING"])

    return {
        "total_biens": total,
        "vendus": vendus,
        "disponibles": disponibles,
        "sous_offre": sous_offre,
        "taux_vente_pct": round(vendus / total * 100, 1) if total else 0,
        "prix_moyen": round(df["price"].mean(), 2) if total else 0,
        "prix_median": round(df["price"].median(), 2) if total else 0,
        "surface_moyenne": round(df["surface"].mean(), 2) if total else 0,
    }


# ── Biens populaires (villes) ────────────────────────────────────────────────

def biens_populaires_par_ville(df: pd.DataFrame) -> pd.DataFrame:
    """Nombre et prix moyen par ville, triés par volume."""
    result = (
        df.groupby("city")
        .agg(
            nombre_biens=("id", "count"),
            prix_moyen=("price", "mean"),
            surface_moyenne=("surface", "mean"),
        )
        .round(2)
        .sort_values("nombre_biens", ascending=False)
        .reset_index()
    )
    return result


# ── Prédiction de prix ───────────────────────────────────────────────────────

def predire_prix(df: pd.DataFrame):
    """
    Régression linéaire : prédit le prix en fonction de la surface,
    du type de bien et de la ville.
    Retourne le modèle entraîné et les métriques.
    """
    data = df[["price", "surface", "type", "city"]].dropna().copy()
    if len(data) < 10:
        return None, {"error": "Pas assez de données pour entraîner un modèle"}

    le_type = LabelEncoder()
    le_city = LabelEncoder()
    data["type_enc"] = le_type.fit_transform(data["type"])
    data["city_enc"] = le_city.fit_transform(data["city"])

    X = data[["surface", "type_enc", "city_enc"]]
    y = data["price"]

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = LinearRegression()
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    metrics = {
        "mae": round(mean_absolute_error(y_test, y_pred), 2),
        "r2": round(r2_score(y_test, y_pred), 4),
        "nb_samples": len(data),
    }
    return model, metrics


# ── Graphiques ───────────────────────────────────────────────────────────────

def graphique_prix_par_ville(df: pd.DataFrame):
    fig, ax = plt.subplots(figsize=(10, 5))
    ville_prix = df.groupby("city")["price"].mean().sort_values(ascending=False).head(10)
    ville_prix.plot(kind="bar", ax=ax, color="#3b5bdb")
    ax.set_title("Prix moyen par ville (Top 10)", fontsize=14)
    ax.set_xlabel("Ville")
    ax.set_ylabel("Prix moyen (€)")
    ax.tick_params(axis="x", rotation=45)
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "prix_par_ville.png")
    fig.savefig(path, dpi=150)
    plt.close(fig)
    return path


def graphique_distribution_types(df: pd.DataFrame):
    type_labels = {
        "APARTMENT": "Appartement",
        "HOUSE": "Maison",
        "COMMERCIAL": "Local commercial",
        "LAND": "Terrain",
    }
    counts = df["type"].map(type_labels).value_counts()
    fig, ax = plt.subplots(figsize=(6, 6))
    counts.plot(kind="pie", ax=ax, autopct="%1.1f%%", startangle=90)
    ax.set_title("Répartition des types de biens", fontsize=14)
    ax.set_ylabel("")
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "repartition_types.png")
    fig.savefig(path, dpi=150)
    plt.close(fig)
    return path


def graphique_prix_vs_surface(df: pd.DataFrame):
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.scatter(df["surface"], df["price"], alpha=0.5, color="#3b5bdb", edgecolors="white", linewidth=0.5)
    ax.set_title("Prix en fonction de la surface", fontsize=14)
    ax.set_xlabel("Surface (m²)")
    ax.set_ylabel("Prix (€)")
    plt.tight_layout()
    path = os.path.join(OUTPUT_DIR, "prix_vs_surface.png")
    fig.savefig(path, dpi=150)
    plt.close(fig)
    return path


# ── Point d'entrée ───────────────────────────────────────────────────────────

def run_analysis(df: pd.DataFrame) -> dict:
    """Lance toutes les analyses et retourne un rapport consolidé."""
    rapport = rapport_ventes(df)
    villes = biens_populaires_par_ville(df).to_dict(orient="records")
    _, metrics = predire_prix(df)

    plots = {}
    if not df.empty:
        plots["prix_par_ville"] = graphique_prix_par_ville(df)
        plots["repartition_types"] = graphique_distribution_types(df)
        plots["prix_vs_surface"] = graphique_prix_vs_surface(df)

    return {
        "rapport_ventes": rapport,
        "biens_populaires_par_ville": villes,
        "prediction_model_metrics": metrics,
        "graphiques": plots,
    }


if __name__ == "__main__":
    from db import load_properties
    df = load_properties()
    if df.empty:
        print("Aucune donnée en base. Utilisez les données de démo.")
        # Données de démo
        df = pd.DataFrame({
            "id": range(1, 21),
            "price": [250000, 320000, 180000, 450000, 95000, 280000, 390000,
                       150000, 520000, 175000, 310000, 420000, 88000, 340000,
                       195000, 470000, 230000, 360000, 115000, 490000],
            "surface": [65, 95, 45, 140, 30, 75, 110, 38, 160, 42,
                        88, 125, 25, 100, 55, 145, 68, 105, 32, 155],
            "city": ["Paris", "Lyon", "Marseille", "Paris", "Toulouse",
                     "Lyon", "Paris", "Marseille", "Nice", "Toulouse",
                     "Lyon", "Paris", "Marseille", "Nice", "Toulouse",
                     "Paris", "Lyon", "Nice", "Marseille", "Paris"],
            "type": ["APARTMENT", "HOUSE", "APARTMENT", "HOUSE", "LAND",
                     "APARTMENT", "HOUSE", "APARTMENT", "HOUSE", "COMMERCIAL",
                     "APARTMENT", "HOUSE", "LAND", "APARTMENT", "HOUSE",
                     "HOUSE", "APARTMENT", "COMMERCIAL", "LAND", "HOUSE"],
            "status": ["AVAILABLE", "SOLD", "AVAILABLE", "PENDING", "AVAILABLE",
                       "SOLD", "AVAILABLE", "AVAILABLE", "SOLD", "AVAILABLE",
                       "PENDING", "AVAILABLE", "AVAILABLE", "SOLD", "AVAILABLE",
                       "AVAILABLE", "PENDING", "AVAILABLE", "SOLD", "AVAILABLE"],
        })

    results = run_analysis(df)

    print("\n=== RAPPORT Y-PLAZA ===")
    print(f"Total biens : {results['rapport_ventes']['total_biens']}")
    print(f"Vendus       : {results['rapport_ventes']['vendus']} ({results['rapport_ventes']['taux_vente_pct']}%)")
    print(f"Prix moyen   : {results['rapport_ventes']['prix_moyen']:,.0f} €")
    print(f"\nTop 5 villes :")
    for v in results["biens_populaires_par_ville"][:5]:
        print(f"  {v['city']:<15} {v['nombre_biens']} biens  |  {v['prix_moyen']:>10,.0f} €")
    print(f"\nMétriques du modèle de prédiction : {results['prediction_model_metrics']}")
    print(f"\nGraphiques générés dans : {OUTPUT_DIR}")
