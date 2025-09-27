from fastapi import FastAPI
from app.routes import challenge, submit
from app.middleware.rate_limiter import rate_limiter
from dotenv import load_dotenv

app = FastAPI(title="Syntax Sifu API")
app.middleware("http")(rate_limiter)

# Routers

app.include_router(challenge.router)
app.include_router(submit.router)

@app.get("/")
def root():
    return {"message": "Syntax Sifu API is alive... for now."}

