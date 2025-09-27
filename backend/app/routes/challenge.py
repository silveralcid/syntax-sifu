#challenge.py

from fastapi import APIRouter
import json, random
from pathlib import Path

router = APIRouter(prefix="/challenge", tags=["challenge"])

# Load all challenge files from /challenges folder
challenge_dir = Path(__file__).resolve().parents[2] / "challenges"
challenge_bank = []

for file in challenge_dir.glob("*.json"):
    with open(file, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
            if isinstance(data, list):
                challenge_bank.extend(data)
        except json.JSONDecodeError as e:
            print(f"⚠️ Error loading {file}: {e}")

@router.get("/")
def get_challenge(category: str = None):
    if category:
        challenges = [c for c in challenge_bank if c["category"].lower() == category.lower()]
    else:
        challenges = challenge_bank
    return random.choice(challenges) if challenges else {"error": "No challenges found for the category."}
