# backend/app/services/prompt.py

from typing import List, Dict, Any


def build_prompt(language: str, code: str, fn_name: str, tests: List[Dict[str, Any]], challenge_prompt: str) -> str:
    """
    Build the validation prompt for LLMs, including the challenge description.
    """
    return f"""
You are a strict code validator.

The challenge is:
{challenge_prompt}

The user wrote this code in {language}:

```{language}
{code}
```

The function should be named {fn_name}.
Run the following test cases mentally and check correctness:
{tests}
If the tests do not make sense for the challenge, audit the code yourself as a fallback.

Return ONLY valid JSON in this format:
{{
  "passed": true/false,
  "failed_cases": [
    {{"input": ..., "expected": ..., "got": ...}}
  ],
  "error": null or string
}}
"""
