from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/submit_code", tags=["submit"])

class Submission(BaseModel):
    code: str
    fn_name: str
    language: str
    tests: list

@router.post("/")
def submit_code(submission: Submission):
    # Placeholder
    return {"received": submission.dict(), "status": "runner not implemented"}