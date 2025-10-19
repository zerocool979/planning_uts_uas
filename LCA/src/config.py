import os
from dotenv import load_dotenv

# Muat variabel lingkungan dari file .env jika ada
load_dotenv()

class Config:
    """
    Base configuration class.
    Semua environment (dev, test, prod) akan mewarisi class ini.
    """

    # --- General App Config ---
    SECRET_KEY = os.getenv("SECRET_KEY", "super_secret_key_lca")
    FLASK_APP = os.getenv("FLASK_APP", "src.app")
    FLASK_ENV = os.getenv("FLASK_ENV", "development")

    # --- Database Config ---
    BASE_DIR = os.path.abspath(os.path.dirname(__file__))
    SQLALCHEMY_DATABASE_URI = os.getenv(
        "DATABASE_URL",
        f"sqlite:///{os.path.join(BASE_DIR, '../app.db')}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # --- File Uploads & Static ---
    UPLOAD_FOLDER = os.path.join(BASE_DIR, "static/uploads")
    ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

    # --- ML & AI Integration ---
    ML_MODEL_PATH = os.path.join(BASE_DIR, "../machine_learning/trained_model.joblib")
    SCALER_PATH = os.path.join(BASE_DIR, "../machine_learning/scaler.joblib")
    EVALUATION_REPORT_PATH = os.path.join(BASE_DIR, "../machine_learning/evaluation_report.json")
    GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")

    # --- Flask-Login ---
    REMEMBER_COOKIE_DURATION = int(os.getenv("REMEMBER_COOKIE_DURATION", 86400))  # default: 1 hari


class DevelopmentConfig(Config):
    """
    Config untuk environment development lokal.
    """
    DEBUG = True
    SQLALCHEMY_ECHO = False  # tampilkan query SQL di terminal


class TestingConfig(Config):
    """
    Config untuk environment testing (pytest / unittest).
    """
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    DEBUG = True


class ProductionConfig(Config):
    """
    Config untuk environment production (deployment).
    """
    DEBUG = False
    TESTING = False
    SESSION_COOKIE_SECURE = True
    PREFERRED_URL_SCHEME = "https"
