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
        selected_categories = [c.strip().lower() for c in category.split(",")]
        challenges = [c for c in challenge_bank if c["category"].lower() in selected_categories]
    else:
        challenges = challenge_bank

    return random.choice(challenges) if challenges else {"error": "No challenges found for the given categories."}


@router.get("/challenges")
def get_challenges(
    category: str = Query(None, description="Comma-separated categories"),
    limit: int = Query(10, ge=1),
    shuffle: bool = False,
    seed: int = None
):
    if category:
        selected_categories = [c.strip().lower() for c in category.split(",")]
        challenges = [c for c in challenge_bank if c["category"].lower() in selected_categories]
    else:
        challenges = challenge_bank

    if not challenges:
        return {"error": "No challenges found for the given categories."}

    if shuffle:
        if seed is not None:
            random.seed(seed)
        random.shuffle(challenges)

    return challenges[:limit] if limit else challenges


@router.get("/categories")
def get_categories():
    """
    Return categories along with the number of challenges in each.
    Example:
    [
      { "category": "loops", "count": 12 },
      { "category": "strings", "count": 15 }
    ]
    """
    categories = {}
    for c in challenge_bank:
        cat = c["category"]
        categories[cat] = categories.get(cat, 0) + 1

    return [{"category": cat, "count": count} for cat, count in sorted(categories.items())]
