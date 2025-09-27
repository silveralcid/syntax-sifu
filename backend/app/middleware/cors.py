# backend/app/middleware/cors.py
from fastapi.middleware.cors import CORSMiddleware


def add_cors(app):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "https://syntax-sifu.vercel.app",
            "https://www.syntaxsifu.com"
            "http://localhost:3000"
        ],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
