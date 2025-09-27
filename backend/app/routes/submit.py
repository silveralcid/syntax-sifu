# backend/app/routes/submit.py

from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Any
from app.services.runner import run_code
from app.core.logger import logger
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
        logger.debug(f"📥 Incoming submission: {submission.dict()}")

        results = run_code(
            language=submission.language,
            code=submission.code,
            fn_name=submission.fn_name,
            tests=[t.dict() for t in submission.tests]
        )

        model_used = results.get("_model", "unknown")
        logger.info(f"✅ Code validated using model: {model_used}")

        return {
            "status": "ok",
            "model": model_used,
            "results": results
        }
    except Exception as e:
        logger.exception("❌ Error in submit_code")
        return {"status": "error", "message": str(e)}
