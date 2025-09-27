from fastapi import FastAPI
from app.routes import challenge, submit

app = FastAPI(title="Syntax Sifu API")

# Routers

app.include_router(challenge.router)
app.include_router(submit.router)

@app.get("/")
def root():
    return {"message": "Syntax Sifu API is alive... for now."}

