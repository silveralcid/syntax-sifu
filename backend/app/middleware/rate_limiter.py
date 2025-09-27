# backend/app/middleware/rate_limiter.py

import time
from fastapi import Request
from fastapi.responses import JSONResponse

request_log = {}
RATE_LIMIT = 5      # max requests
WINDOW = 60         # seconds

async def rate_limiter(request: Request, call_next):
    client_ip = request.client.host
    now = time.time()

    if client_ip not in request_log:
        request_log[client_ip] = []

    request_log[client_ip] = [t for t in request_log[client_ip] if now - t < WINDOW]

    if len(request_log[client_ip]) >= RATE_LIMIT:
        return JSONResponse(
            status_code=429,
            content={"detail": "Rate limit exceeded. Calm down, turbo fingers."}
        )

    request_log[client_ip].append(now)
    return await call_next(request)
