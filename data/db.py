import os
from sqlalchemy import create_engine, text
import pandas as pd
from dotenv import load_dotenv

load_dotenv()

def get_engine():
    url = (
        f"postgresql+psycopg2://{os.getenv('DB_USER', 'admin')}:"
        f"{os.getenv('DB_PASSWORD', 'admin')}@"
        f"{os.getenv('DB_HOST', 'localhost')}:"
        f"{os.getenv('DB_PORT', '5432')}/"
        f"{os.getenv('DB_NAME', 'yplaza')}"
    )
    return create_engine(url)

def load_properties() -> pd.DataFrame:
    engine = get_engine()
    query = """
        SELECT
            p.id,
            p.title,
            p.price,
            p.surface,
            p.city,
            p.type,
            p.status,
            p.created_at,
            a.name  AS agency_name,
            a.city  AS agency_city
        FROM properties p
        LEFT JOIN agencies a ON p.agency_id = a.id
    """
    return pd.read_sql(query, engine)

def load_agencies() -> pd.DataFrame:
    engine = get_engine()
    return pd.read_sql("SELECT * FROM agencies", engine)
