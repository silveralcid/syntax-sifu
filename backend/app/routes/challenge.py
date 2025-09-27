# backend/app/routes/challenge.py

from fastapi import APIRouter, Query
import json, random
from pathlib import Path

router = APIRouter(tags=["challenge"])

# Load all challenges from JSON files in the challenges directory
challenges_dir = Path(__file__).resolve().parents[2] / "challenges"
challenge_bank = []

for file in challenges_dir.glob("*.json"):
    with open(file, "r", encoding="utf-8") as f:
        try:
            challenge_bank.extend(json.load(f))
        except json.JSONDecodeError:
            print(f"⚠️ Skipping invalid JSON in {file}")


@router.get("/challenge/random")
def get_random_challenge(category: str = None):
    if category:
        challenges = [c for c in challenge_bank if c["category"].lower() == category.lower()]
    else:
        challenges = challenge_bank
    return random.choice(challenges) if challenges else {"error": "No challenges found for the category."}


@router.get("/challenges")
def get_challenges(category: str = None, limit: int = Query(None, ge=1)):
    if category:
        challenges = [c for c in challenge_bank if c["category"].lower() == category.lower()]
    else:
        challenges = challenge_bank

    if not challenges:
        return {"error": "No challenges found for the category."}

    if limit:
        return challenges[:limit]
    return challenges


@router.get("/categories")
def get_categories():
    categories = sorted(set(c["category"] for c in challenge_bank))
    return {"categories": categories}
