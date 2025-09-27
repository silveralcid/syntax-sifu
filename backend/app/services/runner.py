import requests
import os
import time
import json
from typing import List, Dict, Any

from app.core.config import OPENROUTER_API_KEY
from app.core.logger import logger
from app.services.prompt import build_prompt

OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# Priority list of models: best → fallback
MODEL_CHAIN = [
    "qwen/qwen3-coder:free",             # best for code
    "deepseek/deepseek-r1:free",         # reasoning + coding
    "google/gemini-2.0-flash-exp:free",  # fast & decent
    "google/gemini-2.5-flash-lite"       # paid fallback
]


def run_code(language: str, code: str, fn_name: str, tests: List[Dict[str, Any]], challenge_prompt: str = "") -> Dict[str, Any]:
    """
    Validate user code using OpenRouter LLMs.
    Tries models in MODEL_CHAIN order with exponential backoff between failures.
    """

    def _ask_model(model: str) -> Dict[str, Any]:
        prompt = build_prompt(language, code, fn_name, tests, challenge_prompt)

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        body = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0
        }

        logger.debug(f"🚀 Sending request to model: {model}")
        logger.debug(f"🔹 Prompt (first 300 chars): {prompt[:300]}...")
        logger.debug(f"🔹 Tests: {tests}")

        r = requests.post(
            OPENROUTER_URL,
            headers=headers,
            json=body,
            timeout=30
        )
        r.raise_for_status()

        content = r.json()["choices"][0]["message"]["content"].strip()
        logger.debug(f"📩 Raw response from {model}: {content[:200]}...")

        # 🔹 Clean markdown fences like ```json ... ```
        if content.startswith("```"):
            lines = content.splitlines()
            # drop first and last if they are fences
            if lines[0].startswith("```"):
                lines = lines[1:]
            if lines and lines[-1].startswith("```"):
                lines = lines[:-1]
            content = "\n".join(lines).strip()
            # remove "json" prefix if present
            if content.lower().startswith("json"):
                content = content[4:].strip()

        try:
            parsed = json.loads(content)
            parsed["_model"] = model
            logger.info(f"✅ Validation completed using {model}")
            return parsed
        except json.JSONDecodeError:
            logger.warning(f"⚠️ {model} returned invalid JSON")
            return {
                "passed": False,
                "failed_cases": [],
                "error": "Invalid JSON from model",
                "_model": model,
                "_raw": content  # 👈 keep raw for debugging
            }

    last_error = None

    for attempt, model in enumerate(MODEL_CHAIN):
        try:
            return _ask_model(model)
        except Exception as e:
            logger.warning(f"⚠️ Model {model} failed: {e}")
            last_error = str(e)

            # Exponential backoff before trying next model
            delay = min(2 ** attempt, 10)  # cap at 10s
            logger.debug(f"⏳ Waiting {delay}s before trying next model...")
            time.sleep(delay)

    logger.error(f"❌ All models failed. Last error: {last_error}")
    return {
        "passed": False,
        "failed_cases": [],
        "error": f"All models failed. Last error: {last_error}",
        "_model": "none"
    }
