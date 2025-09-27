# backend/app/services/runner.py

import requests
import os
from typing import List, Dict, Any
import json

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

PRIMARY_MODEL = "qwen/qwen3-coder:free"
FALLBACK_MODEL = "deepseek/deepseek-r1-0528:free"

def run_code(language: str, code: str, fn_name: str, tests: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Validate user code using OpenRouter's Qwen3 Coder model.
    Falls back to DeepSeek R1 if primary model fails.
    Returns structured results: passed/failed cases, errors.
    """

    def _ask_model(model: str) -> Dict[str, Any]:
        prompt = f"""
You are a strict code validator. The user wrote this code in {language}:

```{language}
{code}
```

The function should be named {fn_name}.
Run the following test cases mentally and check correctness:

{tests}

Return ONLY valid JSON in this format:
{{
  "passed": true/false,
  "failed_cases": [
    {{"input": ..., "expected": ..., "got": ...}}
  ],
  "error": null or string
}}
"""

        headers = {
            "Authorization": f"Bearer {OPENROUTER_API_KEY}",
            "Content-Type": "application/json"
        }

        body = {
            "model": model,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0
        }

        r = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers=headers,
            json=body,
            timeout=30
        )
        r.raise_for_status()

        content = r.json()["choices"][0]["message"]["content"].strip()

        try:
            return json.loads(content)
        except json.JSONDecodeError:
            return {"passed": False, "failed_cases": [], "error": "Invalid JSON from model"}

    # Try primary model first
    try:
        return _ask_model(PRIMARY_MODEL)
    except Exception as e:
        print(f"⚠️ Primary model failed: {e}. Falling back to {FALLBACK_MODEL}.")
        try:
            return _ask_model(FALLBACK_MODEL)
        except Exception as e2:
            return {"passed": False, "failed_cases": [], "error": f"Both models failed: {str(e2)}"}