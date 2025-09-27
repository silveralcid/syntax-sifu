# backend/app/core/logger.py
import logging

# Configure root logger
logging.basicConfig(
    level=logging.DEBUG,  # change to INFO or WARNING in prod
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)

logger = logging.getLogger("syntax-sifu")
