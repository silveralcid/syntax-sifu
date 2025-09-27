from fastapi import APIRouter
import json, random
from pathlib import Path

router = APIRouter(prefix="/challenge", tags=["challenge"])

# Load challenges from JSON file

challenge_file = Path(__file__).resolve().parents[2] / "challenges.json"
with open(challenge_file, "r", encoding="utf-8") as f:
    challenge_bank = json.load(f)

@router.get("/")
def get_challenge(category: str = None):
    if category:
        challenges = [c for c in challenge_bank if c["category"].lower() == category.lower()]
    else:
        challenges = challenge_bank
    return random.choice(challenges) if challenges else {"error": "No challenges found for the category."}