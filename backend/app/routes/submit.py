# backend/app/routes/submit.py

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Any, Dict

# import the runner (implemented in backend/app/services/runner.py)
from app.services.runner import run_code  

router = APIRouter(prefix="/submit_code", tags=["submit"])

class TestCase(BaseModel):
    input: List[Any]
    output: Any

class Submission(BaseModel):
    code: str
    fn_name: str
    language: str
    tests: List[TestCase]

@router.post("/")
def submit_code(submission: Submission):
    try:
        results = run_code(
            language=submission.language,
            code=submission.code,
            fn_name=submission.fn_name,
            tests=[t.dict() for t in submission.tests]
        )

        # Include which model validated the code in the response explicitly
        model_used = results.get("_model", "unknown")

        return {
            "status": "ok",
            "model": model_used,
            "results": results
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}