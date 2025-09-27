# backend/app/services/runner.py

import requests
import os
from typing import List, Dict, Any
import json
from app.core.config import OPENROUTER_API_KEY

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"

# Priority list of models: best → fallback
MODEL_CHAIN = [
    "qwen/qwen3-coder:free",             # best for code
    "deepseek/deepseek-r1:free",         # reasoning + coding
    "deepseek/deepseek-r1-0528:free",    # alt DeepSeek R1
    "deepseek/deepseek-chat-v3.1:free",  # chat fallback
    "qwen/qwen3-235b-a22b:free",         # massive Qwen model
    "google/gemini-2.0-flash-exp:free",  # fast & decent
    "meta-llama/llama-3.3-70b-instruct:free"  # strong generalist
]


def run_code(language: str, code: str, fn_name: str, tests: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Validate user code using OpenRouter LLMs.
    Tries models in MODEL_CHAIN order until one succeeds.
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
            OPENROUTER_URL,
            headers=headers,
            json=body,
            timeout=30
        )
        r.raise_for_status()

        content = r.json()["choices"][0]["message"]["content"].strip()

        try:
            parsed = json.loads(content)
            print(f"✅ Validation completed using {model}")
            parsed["_model"] = model  # attach model info
            return parsed
        except json.JSONDecodeError:
            print(f"⚠️ {model} returned invalid JSON")
            return {"passed": False, "failed_cases": [], "error": "Invalid JSON from model", "_model": model}

    last_error = None

    for model in MODEL_CHAIN:
        try:
            return _ask_model(model)
        except Exception as e:
            print(f"⚠️ Model {model} failed: {e}")
            last_error = str(e)
            continue

    print("❌ All models failed.")
    return {"passed": False, "failed_cases": [], "error": f"All models failed. Last error: {last_error}"}