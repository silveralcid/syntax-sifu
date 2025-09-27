from fastapi import FastAPI
from app.routes import challenge, submit
from app.middleware.rate_limiter import rate_limiter
from dotenv import load_dotenv
from app.middleware.cors import add_cors

app = FastAPI(title="Syntax Sifu API")


# Middleware
app.middleware("http")(rate_limiter)
add_cors(app)

# Routers

app.include_router(challenge.router)
app.include_router(submit.router)

@app.get("/")
def root():
    return {"message": "Syntax Sifu API is alive... for now."}

