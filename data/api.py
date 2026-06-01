"""
Mini API Flask exposant les résultats d'analyse pour le frontend.
Accessible sur http://localhost:5001/api/analytics
"""

from flask import Flask, jsonify
from flask_cors import CORS
import pandas as pd
from analysis import run_analysis

try:
    from db import load_properties
    _USE_DB = True
except Exception:
    _USE_DB = False

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

DEMO_DATA = pd.DataFrame({
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


def _load() -> pd.DataFrame:
    if _USE_DB:
        try:
            df = load_properties()
            return df if not df.empty else DEMO_DATA
        except Exception:
            pass
    return DEMO_DATA


@app.get("/api/analytics")
def analytics():
    df = _load()
    results = run_analysis(df)
    # Remove file paths from response — not needed by frontend
    results.pop("graphiques", None)
    return jsonify(results)


@app.get("/api/analytics/cities")
def cities():
    df = _load()
    from analysis import biens_populaires_par_ville
    data = biens_populaires_par_ville(df).to_dict(orient="records")
    return jsonify(data)


@app.get("/api/analytics/summary")
def summary():
    df = _load()
    from analysis import rapport_ventes
    return jsonify(rapport_ventes(df))


if __name__ == "__main__":
    app.run(port=5001, debug=True)
