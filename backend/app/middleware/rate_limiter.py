# backend/app/middleware/rate_limiter.py
import time
from fastapi import Request
from fastapi.responses import JSONResponse
from app.core.config import RATE_LIMIT, RATE_LIMIT_WINDOW, RATE_LIMIT_ENABLED

request_log = {}


async def rate_limiter(request: Request, call_next):
    if not RATE_LIMIT_ENABLED:
        # Skip entirely if disabled
        return await call_next(request)

    client_ip = request.client.host
    now = time.time()

    if client_ip not in request_log:
        request_log[client_ip] = []

    # prune old requests outside the window
    request_log[client_ip] = [
        t for t in request_log[client_ip] if now - t < RATE_LIMIT_WINDOW
    ]

    if len(request_log[client_ip]) >= RATE_LIMIT:
        return JSONResponse(
            status_code=429,
            content={
                "detail": f"Rate limit exceeded. Max {RATE_LIMIT} requests per {RATE_LIMIT_WINDOW} seconds."
            },
        )

    request_log[client_ip].append(now)
    return await call_next(request)
