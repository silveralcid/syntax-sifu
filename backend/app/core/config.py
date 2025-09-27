# backend/app/core/config.py
import os
from pathlib import Path
from dotenv import load_dotenv

# Explicit path to backend/.env
env_path = Path(__file__).resolve().parents[2] / ".env"
load_dotenv(dotenv_path=env_path)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
