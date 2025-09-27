# backend/app/core/config.py
import os
from pathlib import Path
from dotenv import load_dotenv

# Explicit path to backend/.env
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

# API keys
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

# Rate limiting (default 5 requests / 60 seconds if not set in .env)
RATE_LIMIT_ENABLED = os.getenv("RATE_LIMIT_ENABLED", "true").lower() == "true"
RATE_LIMIT = int(os.getenv("RATE_LIMIT", 5))
RATE_LIMIT_WINDOW = int(os.getenv("RATE_LIMIT_WINDOW", 60))
